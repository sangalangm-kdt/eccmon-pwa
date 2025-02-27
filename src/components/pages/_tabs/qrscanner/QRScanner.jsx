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

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [willScan, setWillScan] = useState(true);
  const [message, setMessage] = useState("");
  const [addDisable, setAddDisable] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [currentCamera, setCurrentCamera] = useState("back"); // Track current camera
  const [cameraSwitched, setCameraSwitched] = useState(false); // Track camera switch state
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("qrScanner", "common");
  const { checkSerial, addCylinder } = useCylinderCover();

  const codeReader = new BrowserMultiFormatReader();

  const handleScanResult = (result, err) => {
    if (result) {
      try {
        const jsonData = JSON.parse(result.text);
        const eccId = jsonData.eccId;

        if (!eccId) {
          setError("The scanned code does not contain a valid code.");
          return;
        }

        if (!modalOpen) {
          setWillScan(false);
          checkSerial({
            setAddDisable,
            setMessage,
            setModalOpen,
            eccId,
          });
        }

        const track = videoRef.current?.srcObject?.getVideoTracks()[0];
        if (track) {
          setScannedData(eccId);
          codeReader.reset();
        }
      } catch (e) {
        setError("Invalid JSON data. Please check the QR code.");
      }
    } else if (err && !(err instanceof NotFoundException)) {
      console.error(err);
      setError("Error scanning QR code. Please try again.");
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
    if (!willScan) {
      stopCamera();
    }

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

          console.log("FRONT CAMERA: ", frontCamera);
          console.log("BACK CAMERA: ", backCamera);

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
              area: {
                x: 0.25,
                y: 0.25,
                width: 0.5,
                height: 0.5,
              },
              formats: [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX],
            },
          );

          // Check if area is in the center
          setIsCentered(
            isAreaInCenter({
              x: 0.25,
              y: 0.25,
              width: 0.5,
              height: 0.5,
            }),
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
      codeReader.reset();
    };
  }, [willScan, currentCamera]);

  useEffect(() => {
    dispatch(setPage("qrscanner"));
  }, [dispatch]);

  const handleBack = () => {
    codeReader.reset();
    setWillScan(false);
    navigate("/");
  };

  const toggleTorch = () => {
    const track = videoRef.current?.srcObject?.getVideoTracks()[0];
    if (track) {
      const capabilities = track.getCapabilities();
      if (capabilities.torch) {
        track
          .applyConstraints({
            advanced: [{ torch: !torchOn }],
          })
          .then(() => {
            setTorchOn(!torchOn);
          })
          .catch((err) => {
            console.error("Error toggling torch: ", err);
          });
      } else {
        console.error("Torch is not supported on this device.");
        setError(t("qrScanner:torchNotSupported")); // Add a translation key for this message
      }
    }
  };

  const handleSwitchCamera = () => {
    setCurrentCamera((prevCamera) => {
      const newCamera = prevCamera === "back" ? "front" : "back";
      setCameraSwitched(true);

      // Hide the camera switch message after 2 seconds
      setTimeout(() => {
        setCameraSwitched(false);
      }, 2000);

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

    const isExisting = checkSerial({
      setAddDisable,
      setMessage,
      setModalOpen,
      eccId: manualData,
    });
    if (isExisting) {
      setMessage("This ECC ID already exists.");
      setModalOpen(false);
      setAddDisable(true);
    } else {
      checkSerial({
        setAddDisable,
        setMessage,
        setModalOpen,
        eccId: manualData,
      });
    }
  };

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getVideoTracks();
    if (tracks) {
      tracks.forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    console.log("Camera stopped");
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
            <div className={qrScannerStyles.overlayTopClass}></div>
            <div className={qrScannerStyles.overlayBottomClass}></div>
            <div className={qrScannerStyles.overlayLeftClass}></div>
            <div className={qrScannerStyles.overlayRightClass}></div>
            <div
              className={qrScannerStyles.scannerAreaClass}
              style={{
                borderColor: isCentered ? "green" : "red",
              }}
            >
              <div className={qrScannerStyles.scannerFrameClass}>
                <div className="absolute inset-0 bg-transparent"></div>
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.topLeftCornerClass}`}
                ></div>
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.topRightCornerClass}`}
                ></div>
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.bottomLeftCornerClass}`}
                ></div>
                <div
                  className={`${qrScannerStyles.scannerCornerClass} ${qrScannerStyles.bottomRightCornerClass}`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute z-60 text-white xs:top-60 xs:text-sm">
          {t("qrScanner:barcodePlaceCode")}
        </div>

        <button
          className="absolute right-18 top-8 rounded-full bg-transparent p-2 text-white shadow-md"
          onClick={toggleTorch}
        >
          {torchOn ? (
            <IoFlashOutline size={24} />
          ) : (
            <IoFlashOffOutline size={24} />
          )}
        </button>

        {/* Switch Camera Button */}
        <button
          className="focus: absolute right-8 top-9 z-60 rounded-full text-white"
          onClick={handleSwitchCamera}
        >
          <IoCameraReverseOutline size={28} />
        </button>

        <div className="absolute bottom-18 z-60 flex w-80 flex-col justify-center">
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
        isOpen={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        eccId={scannedData}
      />

      <ManuallyAddModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onConfirm={handleManualAdd}
        setWillScan={setWillScan}
      />

      {/* Camera Switch Modal */}
      <CameraSwitchModal
        isOpen={cameraSwitched}
        onClose={() => setCameraSwitched(false)}
      />
    </div>
  );
};

export default QRScanner;
