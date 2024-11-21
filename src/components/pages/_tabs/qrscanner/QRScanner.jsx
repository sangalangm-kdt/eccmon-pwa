import React, { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  NotFoundException,
} from "@zxing/library";
import { useDispatch } from "react-redux";
import { setPage } from "../../../../features/page/pageSlice";
import {
  setScannedCode,
  checkScannedCode,
} from "../../../../features/scannedResult/scannedCodeSlice";
import { useNavigate } from "react-router-dom";
import qrScannerStyles from "../../../styles/main";
import { useTranslation } from "react-i18next";
import { ArrowBackIcon } from "../../../assets/icons";
import Storage from "./status/Storage";

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("qrScanner");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId;

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const backCamera =
          videoInputDevices.find((device) =>
            device.label.toLowerCase().includes("back"),
          ) || videoInputDevices[0];

        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                try {
                  const jsonData = JSON.parse(result.text);
                  console.log("Dispatching Scanned Code:", jsonData);
                  if (!jsonData.eccId) {
                    setError("The scanned code does not contain a valid code.");
                    return;
                  }

                  dispatch(setScannedCode(jsonData));
                  dispatch(checkScannedCode(jsonData.eccId)).then((action) => {
                    if (checkScannedCode.fulfilled.match(action)) {
                      console.log(
                        "Check scanned code successful:",
                        action.payload,
                      );
                      navigate("/scanned-result");
                    } else {
                      setError(
                        "The scanned ECC ID does not exist. A new entry will be created.",
                      );
                    }
                  });

                  setScannedData(jsonData);
                } catch (e) {
                  setError("Invalid JSON data. Please check the QR code.");
                }
              }
              if (err && !(err instanceof NotFoundException)) {
                console.error(err);
                setError("Error scanning QR code. Please try again.");
              }
            },
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
        }
      })
      .catch((err) => {
        console.error("Error accessing video devices: ", err);
        setError(
          "Error accessing video devices. Please check your camera permissions.",
        );
      });

    return () => codeReader.reset();
  }, [dispatch, navigate]);

  useEffect(() => {
    dispatch(setPage("qrscanner"));
  }, [dispatch]);

  const handleBack = () => {
    dispatch(setPage("/")); // Update the page state to 'home'
    navigate("/"); // Navigate to the home page
  };

  const toggleTorch = () => {
    const track = videoRef.current.srcObject?.getVideoTracks()[0];
    if (track) {
      const capabilities = track.getCapabilities();
      if (capabilities.torch) {
        track.applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      } else {
        console.error("Torch is not supported on this device.");
      }
    }
  };

  const renderComponentBasedOnStatus = () => {
    if (scannedData) {
      const { cylinderStatus } = scannedData;
      if (cylinderStatus === "storage") {
        return (
          <Storage
            setIsComplete={() => {}}
            onSaveData={(data) => console.log("Saved storage data:", data)}
          />
        );
      }
    }
    return null;
  };

  return (
    <div
      className={`${qrScannerStyles.containerClass} w-full h-full sm:h-screen sm:w-screen`}
    >
      <div
        className="absolute left-2 top-8 z-50 flex flex-row cursor-pointer p-2"
        onClick={handleBack}
      >
        <ArrowBackIcon />
        <label className="text-white">Back</label>
      </div>
      <div
        className={`${qrScannerStyles.scannerContainerClass} w-full h-full sm:h-screen sm:w-screen`}
      >
        {error && <div className={qrScannerStyles.errorClass}>{error}</div>}
        <video ref={videoRef} className={qrScannerStyles.videoClass} />
        <div className={qrScannerStyles.overlayContainerClass}>
          <div className={qrScannerStyles.overlayClass}>
            <div className={qrScannerStyles.overlayTopClass}></div>
            <div className={qrScannerStyles.overlayBottomClass}></div>
            <div className={qrScannerStyles.overlayLeftClass}></div>
            <div className={qrScannerStyles.overlayRightClass}></div>
            <div className={qrScannerStyles.scannerAreaClass}>
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
        <div className="fixed xs:top-72 xs:text-sm text-white">
          {t("barcodePlaceCode")}
        </div>

        <button
          className="absolute bottom-4 left-4 bg-white p-2 text-blue-500 rounded-full shadow-md"
          onClick={toggleTorch}
        >
          {torchOn ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          )}
        </button>
      </div>

      {renderComponentBasedOnStatus()}
    </div>
  );
};

export default QRScanner;
