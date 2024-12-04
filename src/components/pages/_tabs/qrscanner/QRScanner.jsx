/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import ResultsModal from "./ResultsModal"; // Your modal component
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
import { ArrowBackIcon } from "../../../assets/icons";
import Storage from "./status/Storage";
import { useCylinderCover } from "../../../../hooks/cylinderCover";

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("qrScanner", "common");
  const { checkSerial, addCylinder } = useCylinderCover();
  const [willScan, setWillScan] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId;

    if (willScan) {
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
                    const eccId = jsonData.eccId;

                    if (!eccId) {
                      setError(
                        "The scanned code does not contain a valid code.",
                      );
                      return;
                    }

                    if (!modalOpen) {
                      setWillScan(false);
                      checkSerial({ setModalOpen, eccId });
                      setActionType("add");
                    }

                    const track =
                      videoRef.current?.srcObject?.getVideoTracks()[0];
                    if (track) {
                      setScannedData(eccId);
                      codeReader.reset();
                    }
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
    }

    return () => {
      codeReader.reset();
    };
  }, [checkSerial, modalOpen, willScan]);

  useEffect(() => {
    dispatch(setPage("qrscanner"));
  }, [dispatch]);

  const handleBack = () => {
    setWillScan(false); // Stop scanning on navigation
    navigate("/");
  };

  const toggleTorch = () => {
    const track = videoRef.current?.srcObject?.getVideoTracks()[0];
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

  const handleConfirm = () => {
    setModalOpen(false);
    addCylinder(scannedData);
  };

  const handleClose = () => {
    setWillScan(true);
    setModalOpen(false);
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
        <label className="text-white">{t("common:backButton")}</label>
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
        <div className="absolute xs:top-60 xs:text-sm text-white z-60">
          {t("qrScanner:barcodePlaceCode")}
        </div>
        <button
          className="absolute bottom-4 left-4 bg-white p-2 text-blue-500 rounded-full shadow-md"
          onClick={toggleTorch}
        >
          {torchOn ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
              {/* Torch On Icon */}
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
              {/* Torch Off Icon */}
            </svg>
          )}
        </button>
      </div>

      {renderComponentBasedOnStatus()}

      <ResultsModal
        isOpen={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default QRScanner;
