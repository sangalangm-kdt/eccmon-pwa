/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ResultsModal from "./ResultsModal";
import {
  BrowserMultiFormatReader,
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

const eccIdPattern = /^[A-Z0-9-]+$/i;

const extractEccId = (qrContent) => {
  try {
    const parsed = JSON.parse(qrContent);
    return parsed?.eccId?.trim() || null;
  } catch {
    return qrContent?.trim() || null;
  }
};

const isValidEccId = (eccId) => eccIdPattern.test(eccId);

const hasVideoDimensions = (video) =>
  Boolean(video && video.videoWidth > 0 && video.videoHeight > 0);

const waitForVideoReady = (video) =>
  new Promise((resolve, reject) => {
    if (!video) {
      reject(new Error("missing_video_element"));
      return;
    }

    if (hasVideoDimensions(video)) {
      resolve();
      return;
    }

    const handleLoadedMetadata = () => {
      if (hasVideoDimensions(video)) {
        cleanup();
        resolve();
      }
    };

    const handleError = () => {
      cleanup();
      reject(new Error("video_metadata_error"));
    };

    const cleanup = () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleLoadedMetadata);
    video.addEventListener("error", handleError);
  });

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
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [isCheckingSerial, setIsCheckingSerial] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const cameraSwitchTimeoutRef = useRef(null);
  const isCheckingSerialRef = useRef(false);
  const keepCameraVisibleWhileCheckingRef = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["qrScanner", "common"]);

  const { user } = useAuthentication();
  const { process } = useLocation(user.id);
  const { checkSerial } = useCylinderCover();
  console.log(user);

  const isInsideScanBox = (x, y) => {
    const scanBox = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }; // Adjust as needed
    return (
      x >= scanBox.x * window.innerWidth &&
      x <= (scanBox.x + scanBox.width) * window.innerWidth &&
      y >= scanBox.y * window.innerHeight &&
      y <= (scanBox.y + scanBox.height) * window.innerHeight
    );
  };

  const handleScanResult = async (result, err) => {
    const video = videoRef.current;

    if (
      isCameraInitializing ||
      isCheckingSerialRef.current ||
      !willScan ||
      !hasVideoDimensions(video)
    ) {
      return;
    }

    if (result) {
      const eccId = extractEccId(result.text);

      if (!eccId) {
        setError("errors.enterSerialCode");
        return;
      }

      if (!isValidEccId(eccId)) {
        setError("errors.invalidSerialCode");
        return;
      }

      // Get barcode position (only if available)
      if (result.position) {
        const { x, y } = result.position.topLeft;
        if (!isInsideScanBox(x, y)) {
          return; // Ignore if it's outside the scan box
        }
      }

      const track = videoRef.current?.srcObject?.getVideoTracks()[0];
      if (track) {
        setScannedData(eccId);
        codeReaderRef.current.reset();
      }

      if (!modalOpen) {
        isCheckingSerialRef.current = true;
        keepCameraVisibleWhileCheckingRef.current = true;
        setWillScan(false);
        setIsCheckingSerial(true);
        setError(null);

        try {
          await checkSerial({
            setAddDisable,
            setMessage,
            setModalOpen,
            eccId,
          });
        } catch (error) {
          console.error(error);
          setError("errors.checkSerial");
          setWillScan(true);
        } finally {
          isCheckingSerialRef.current = false;
          setIsCheckingSerial(false);
        }
      }
    } else if (err && !(err instanceof NotFoundException)) {
      console.error(err);
      setError("errors.scan");
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

  const getCameraDeviceId = async () => {
    const videoInputDevices =
      await codeReaderRef.current.listVideoInputDevices();

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
      return backCamera.deviceId;
    }

    if (currentCamera === "front" && frontCamera) {
      return frontCamera.deviceId;
    }

    return videoInputDevices[0]?.deviceId;
  };

  const startCamera = async (isActive = () => true) => {
    const video = videoRef.current;
    if (!video || !navigator.mediaDevices?.getUserMedia) return;

    setIsCameraInitializing(true);
    setError(null);
    stopCamera();
    codeReaderRef.current.reset();
    setTorchOn(false);
    setTorchSupported(false);

    try {
      const selectedDeviceId = await getCameraDeviceId();
      if (!selectedDeviceId || !videoRef.current || !isActive()) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedDeviceId },
        },
      });

      if (!videoRef.current || !isActive()) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      videoRef.current.srcObject = stream;
      await waitForVideoReady(videoRef.current);
      if (!isActive()) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      await videoRef.current.play();

      if (!isActive() || !hasVideoDimensions(videoRef.current)) return;

      const track = videoRef.current?.srcObject?.getVideoTracks?.()[0];
      const capabilities = track?.getCapabilities?.();
      setTorchSupported(Boolean(capabilities?.torch));

      codeReaderRef.current.decodeFromVideoElement(
        videoRef.current,
        handleScanResult,
      );

      // Check if area is in the center
      if (isActive()) {
        setIsCentered(
          isAreaInCenter({
            x: 0.25,
            y: 0.25,
            width: 0.5,
            height: 0.5,
          }),
        );
      }
    } catch (err) {
      console.error("Error accessing video devices: ", err);
      setError("errors.cameraAccess");
    } finally {
      if (isActive()) {
        setIsCameraInitializing(false);
      }
    }
  };

  useEffect(() => {
    if (!willScan) {
      codeReaderRef.current.reset();
      if (!isCheckingSerial) {
        stopCamera();
      }
      return undefined;
    }

    let isActive = true;
    startCamera(() => isActive);

    return () => {
      isActive = false;
      codeReaderRef.current.reset();
      if (keepCameraVisibleWhileCheckingRef.current) {
        keepCameraVisibleWhileCheckingRef.current = false;
        return;
      }
      stopCamera();
    };
  }, [willScan, currentCamera]);

  useEffect(() => {
    if (!willScan && !isCheckingSerial) {
      stopCamera();
    }
  }, [willScan, isCheckingSerial]);

  useEffect(() => {
    return () => {
      if (cameraSwitchTimeoutRef.current) {
        clearTimeout(cameraSwitchTimeoutRef.current);
      }
      codeReaderRef.current.reset();
      stopCamera();
    };
  }, []);

  useEffect(() => {
    dispatch(setPage("qrscanner"));
  }, [dispatch]);

  const handleBack = () => {
    codeReaderRef.current.reset();
    setWillScan(false);
    navigate("/");
  };

  const toggleTorch = async () => {
    if (isCameraInitializing || isCheckingSerial || !torchSupported) return;

    const track = videoRef.current?.srcObject?.getVideoTracks?.()[0];
    if (!track) return;

    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn }],
      });
      setTorchOn(!torchOn);
    } catch (err) {
      console.error("Error toggling torch: ", err);
    }
  };

  const isTorchDisabled =
    isCameraInitializing || isCheckingSerial || !torchSupported;

  const handleSwitchCamera = () => {
    if (isCameraInitializing || isCheckingSerial) return;
    stopCamera();
    codeReaderRef.current.reset();

    setCurrentCamera((prevCamera) => {
      const newCamera = prevCamera === "back" ? "front" : "back";
      setCameraSwitched(true);

      // Hide the camera switch message after 2 seconds
      if (cameraSwitchTimeoutRef.current) {
        clearTimeout(cameraSwitchTimeoutRef.current);
      }
      cameraSwitchTimeoutRef.current = setTimeout(() => {
        setCameraSwitched(false);
      }, 2000);

      return newCamera;
    });
  };

  const handleConfirm = () => {
    setModalOpen(false);
    keepCameraVisibleWhileCheckingRef.current = false;
    navigate("/scanned-result", {
      replace: true,
      state: {
        isNewCylinder: true,
        data: {
          serialNumber: scannedData,
          is_disposed: 1,
          isDisposed: 1,
          status: "None",
          cycle: 0,
          location: "",
        },
      },
    });
  };

  const handleClose = () => {
    setWillScan(true);
    setModalOpen(false);
  };

  const handleManualAdd = async (manualData) => {
    if (isCheckingSerialRef.current) return;

    isCheckingSerialRef.current = true;
    setWillScan(false);
    setScannedData(manualData);
    setIsCheckingSerial(true);
    setError(null);

    try {
      await checkSerial({
        setAddDisable,
        setMessage,
        setModalOpen,
        eccId: manualData,
      });
    } catch (error) {
      console.error(error);
      setError("errors.checkSerial");
      throw error;
    } finally {
      isCheckingSerialRef.current = false;
      setIsCheckingSerial(false);
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (!video?.srcObject) {
      return;
    }

    const tracks = videoRef.current?.srcObject?.getVideoTracks();
    if (tracks) {
      tracks.forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    }

    if (video) {
      video.srcObject = null;
    }

    setTorchOn(false);
    setTorchSupported(false);

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
        {error && (
          <div className={qrScannerStyles.errorClass}>
            {t(`qrScanner:${error}`)}
          </div>
        )}
        <video
          ref={videoRef}
          className={qrScannerStyles.videoClass}
          playsInline
          muted
        />
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

        {isCheckingSerial && !manualModalOpen ? (
          <div
            className="absolute left-1/2 z-[70] w-72 max-w-[85vw] -translate-x-1/2 xs:top-[15.5rem]"
            role="status"
            aria-live="polite"
          >
            <p className="text-center text-xs text-white/90">
              {t("qrScanner:checkingCylinder")}
            </p>
            <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-1/3 rounded-full bg-primary animate-serial-progress" />
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className="absolute right-18 top-8 rounded-full bg-transparent p-2 text-white shadow-md"
          onClick={toggleTorch}
          disabled={isTorchDisabled}
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
        hasStoragePermission={
          user?.isAdmin === 1 || process?.includes("Storage")
        }
      />

      <ManuallyAddModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onConfirm={handleManualAdd}
        setWillScan={setWillScan}
        isLoading={isCheckingSerial}
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
