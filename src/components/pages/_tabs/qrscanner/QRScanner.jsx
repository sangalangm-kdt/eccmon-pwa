/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ResultsModal from "./ResultsModal";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  NotFoundException,
} from "@zxing/library";
import { useDispatch } from "react-redux";
import { setPage } from "../../../../features/page/pageSlice";
import { useNavigate } from "react-router-dom";
import qrScannerStyles from "../../../styles/main";
import { useTranslation } from "react-i18next";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import ManuallyAddModal from "../../../constants/ManuallyAddModal";
import CameraSwitchModal from "../../../constants/CameraSwitchModal";
import {
  IoArrowBack,
  IoCameraReverseOutline,
  IoFlashOffOutline,
  IoFlashOutline,
} from "react-icons/io5";
import { useLocation } from "../../../../hooks/location";
import { useAuthentication } from "../../../../hooks/auth";
import { serialCodePattern } from "../../../constants/ManuallyAddModal";
import { mapBackendMessage } from "./errorMessages";

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [willScan, setWillScan] = useState(true);
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState("info");
  const [addDisable, setAddDisable] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [currentCamera, setCurrentCamera] = useState("back");
  const [cameraSwitched, setCameraSwitched] = useState(false);

  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("qrScanner", "common");

  const { user } = useAuthentication();
  const { process } = useLocation(user.id);
  const { checkSerial, addCylinder } = useCylinderCover();

  // ✅ FIX: create reader once
  const codeReaderRef = useRef(null);
  if (!codeReaderRef.current) {
    codeReaderRef.current = new BrowserMultiFormatReader();
  }

  const isInsideScanBox = (x, y) => {
    const scanBox = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 };
    return (
      x >= scanBox.x * window.innerWidth &&
      x <= (scanBox.x + scanBox.width) * window.innerWidth &&
      y >= scanBox.y * window.innerHeight &&
      y <= (scanBox.y + scanBox.height) * window.innerHeight
    );
  };

  const validateEccId = (value) => {
    const normalized = (value ?? "").trim().toUpperCase();
    if (!normalized) return { ok: false, value: "", reason: "empty" };
    if (!serialCodePattern.test(normalized))
      return { ok: false, value: normalized, reason: "invalid" };
    return { ok: true, value: normalized, reason: null };
  };

  const errorTimerRef = useRef(null);
  const showError = (msg, ms = 2200) => {
    setError(msg);
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    errorTimerRef.current = window.setTimeout(() => {
      setError(null);
      errorTimerRef.current = null;
    }, ms);
  };

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    };
  }, []);

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getVideoTracks();
    if (tracks) {
      tracks.forEach((track) => {
        if (track.readyState === "live") track.stop();
      });
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const setBackendMessage = (msgOrMapped) => {
    // if caller passed { text, severity }
    if (msgOrMapped && typeof msgOrMapped === "object") {
      setMessage(msgOrMapped.text ?? "");
      setMessageSeverity(msgOrMapped.severity ?? "info");
      return;
    }

    const mapped = mapBackendMessage(t, msgOrMapped);
    setMessage(mapped.text);
    setMessageSeverity(mapped.severity);
  };

  const handleScanResult = (result, err) => {
    if (result) {
      let raw = "";
      try {
        const parsed = JSON.parse(result.text);
        raw = parsed?.eccId ?? "";
      } catch {
        raw = result.text ?? "";
      }

      const validated = validateEccId(raw);
      if (!validated.ok) {
        showError(
          validated.reason === "empty"
            ? t("qrScanner:errors.enterSerialCode")
            : t("qrScanner:errors.invalidSerialCode"),
        );
        return;
      }

      setError(null);
      const eccId = validated.value;

      if (result.position) {
        const { x, y } = result.position.topLeft;
        if (!isInsideScanBox(x, y)) return;
      }

      if (!modalOpen) {
        setWillScan(false);
        checkSerial({
          t,
          setAddDisable,
          setMessage: setBackendMessage,
          setSeverity: setMessageSeverity,
          setModalOpen,
          eccId,
        });
      }

      const track = videoRef.current?.srcObject?.getVideoTracks()[0];
      if (track) {
        setScannedData(eccId);

        // ✅ FIX: reset the SAME reader instance
        codeReaderRef.current?.reset();
      }
    } else if (err && !(err instanceof NotFoundException)) {
      console.error(err);
      setError("Error scanning code. Please try again.");
    }
  };

  const isAreaInCenter = (area) => {
    const { x, y, width, height } = area;
    const tolerance = 0.05;

    const isCenteredHorizontally = x >= 0.5 - tolerance && x <= 0.5 + tolerance;
    const isCenteredVertically = y >= 0.5 - tolerance && y <= 0.5 + tolerance;
    const isReasonablySized =
      width >= 0.1 && width <= 0.8 && height >= 0.1 && height <= 0.8;

    return isCenteredHorizontally && isCenteredVertically && isReasonablySized;
  };

  useEffect(() => {
    const codeReader = codeReaderRef.current;

    if (!willScan) stopCamera();

    let selectedDeviceId;
    if (willScan) {
      codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
          const backCamera =
            videoInputDevices.find((device) =>
              device.label.toLowerCase().includes("back"),
            ) || videoInputDevices[0];

          const frontCamera =
            videoInputDevices.find((device) =>
              device.label.toLowerCase().includes("front"),
            ) || videoInputDevices[0];

          if (currentCamera === "back" && backCamera) {
            selectedDeviceId = backCamera.deviceId;
          } else if (currentCamera === "front" && frontCamera) {
            selectedDeviceId = frontCamera.deviceId;
          }

          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            handleScanResult,
            {
              area: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 },
              formats: [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX],
            },
          );

          setIsCentered(
            isAreaInCenter({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 }),
          );
        })
        .catch((err) => {
          console.error("Error accessing video devices: ", err);
          setError(
            "Error accessing video devices. Please check your camera permissions.",
          );
        });
    }

    return () => {
      // ✅ FIX: reset the SAME reader instance
      codeReader?.reset();
    };
  }, [willScan, currentCamera]);

  useEffect(() => {
    dispatch(setPage("qrscanner"));
  }, [dispatch]);

  const handleBack = () => {
    codeReaderRef.current?.reset();
    setWillScan(false);
    navigate("/");
  };

  const toggleTorch = () => {
    const track = videoRef.current?.srcObject?.getVideoTracks()[0];
    if (track) {
      const capabilities = track.getCapabilities();
      if (capabilities.torch) {
        track
          .applyConstraints({ advanced: [{ torch: !torchOn }] })
          .then(() => setTorchOn(!torchOn))
          .catch((err) => console.error("Error toggling torch: ", err));
      } else {
        console.error("Torch is not supported on this device.");
        setError(t("qrScanner:torchNotSupported"));
      }
    }
  };

  const handleSwitchCamera = () => {
    setCurrentCamera((prevCamera) => {
      const newCamera = prevCamera === "back" ? "front" : "back";
      setCameraSwitched(true);
      setTimeout(() => setCameraSwitched(false), 2000);
      return newCamera;
    });
  };

  const handleConfirm = () => {
    setModalOpen(false);
    addCylinder(scannedData);
  };

  const handleClose = () => {
    setWillScan(true);
    setModalOpen(false);
  };

  const handleManualAdd = (manualData) => {
    setWillScan(false);
    setManualModalOpen(true);
    setScannedData(manualData);

    checkSerial({
      t,
      setAddDisable,
      setMessage: setBackendMessage,
      setSeverity: setMessageSeverity,
      setModalOpen,
      eccId: manualData,
    });
  };

  return (
    <div
      className={`${qrScannerStyles.containerClass} h-full w-full sm:h-screen sm:w-screen`}
    >
      <div
        className="absolute left-2 top-8 z-50 flex cursor-pointer flex-row items-center gap-1 p-2"
        onClick={handleBack}
      >
        <IoArrowBack className="text-white" />
        <label className="text-white">{t("common:backButton")}</label>
      </div>

      <div
        className={`${qrScannerStyles.scannerContainerClass} h-full w-full sm:h-screen sm:w-screen`}
      >
        {error && <div className={qrScannerStyles.errorClass}>{error}</div>}
        <video ref={videoRef} className={qrScannerStyles.videoClass} />

        <div className={qrScannerStyles.overlayContainerClass}>
          <div className={qrScannerStyles.overlayClass}>
            <div className={qrScannerStyles.overlayTopClass} />
            <div className={qrScannerStyles.overlayBottomClass} />
            <div className={qrScannerStyles.overlayLeftClass} />
            <div className={qrScannerStyles.overlayRightClass} />

            <div
              className={qrScannerStyles.scannerAreaClass}
              style={{ borderColor: isCentered ? "green" : "red" }}
            >
              <div className={qrScannerStyles.scannerFrameClass}>
                <div className="absolute inset-0 bg-transparent" />
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.topLeftCornerClass}`}
                />
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.topRightCornerClass}`}
                />
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.bottomLeftCornerClass}`}
                />
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.bottomRightCornerClass}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ FIX: z-60 -> z-[60] */}
        <div className="absolute z-[60] text-white xs:top-60 xs:text-sm">
          {t("qrScanner:barcodePlaceCode")}
        </div>

        {/* ✅ FIX: right-18 -> right-16 */}
        <button
          className="absolute right-16 top-8 rounded-full bg-transparent p-2 text-white shadow-md"
          onClick={toggleTorch}
        >
          {torchOn ? (
            <IoFlashOutline size={24} />
          ) : (
            <IoFlashOffOutline size={24} />
          )}
        </button>

        {/* ✅ FIX: remove 'focus:' typo + z-60 -> z-[60] */}
        <button
          className="absolute right-8 top-9 z-[60] rounded-full text-white"
          onClick={handleSwitchCamera}
        >
          <IoCameraReverseOutline size={28} />
        </button>

        {/* ✅ FIX: bottom-18 -> bottom-16 + z-60 -> z-[60] */}
        <div className="absolute bottom-16 z-[60] flex w-80 flex-col justify-center">
          <label className="mb-2 text-center text-xs text-white">
            {t("qrScanner:cannotScanCode")}
          </label>
          <button
            className="rounded-md border border-white p-3 text-sm font-semibold text-white"
            onClick={() => setManualModalOpen(true)}
          >
            {t("qrScanner:addData")}
          </button>
        </div>
      </div>

      <ResultsModal
        addDisable={addDisable}
        message={message}
        severity={messageSeverity}
        isOpen={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        eccId={scannedData}
        hasStoragePermission={
          user?.isAdmin === 1 || process?.includes("Storage")
        }
      />

      <ManuallyAddModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onConfirm={handleManualAdd}
        setWillScan={setWillScan}
      />

      <CameraSwitchModal
        isOpen={cameraSwitched}
        onClose={() => setCameraSwitched(false)}
      />
    </div>
  );
};

export default QRScanner;
