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
import ManuallyAddModal from "../../../constants/ManuallyAddModal";

const QRScanner = () => {
    const [error, setError] = useState(null);
    const [torchOn, setTorchOn] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [willScan, setWillScan] = useState(true);
    const [message, setMessage] = useState("");
    const [addDisable, setAddDisable] = useState(false);
    const [isCentered, setIsCentered] = useState(false); // State to track if area is centered

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

        const isCenteredHorizontally =
            x >= 0.5 - tolerance && x <= 0.5 + tolerance;
        const isCenteredVertically =
            y >= 0.5 - tolerance && y <= 0.5 + tolerance;
        const isReasonablySized =
            width >= 0.1 && width <= 0.8 && height >= 0.1 && height <= 0.8;

        return (
            isCenteredHorizontally && isCenteredVertically && isReasonablySized
        );
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
                            device.label.toLowerCase().includes("back")
                        ) || videoInputDevices[0];
                    if (backCamera) {
                        selectedDeviceId = backCamera.deviceId;
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
                                formats: [
                                    BarcodeFormat.QR_CODE,
                                    BarcodeFormat.DATA_MATRIX,
                                ],
                            }
                        );
                        // Check if area is in the center
                        setIsCentered(
                            isAreaInCenter({
                                x: 0.25,
                                y: 0.25,
                                width: 0.5,
                                height: 0.5,
                            })
                        );
                    }
                })
                .catch((err) => {
                    console.error("Error accessing video devices: ", err);
                    setError(
                        "Error accessing video devices. Please check your camera permissions."
                    );
                });
        }

        return () => {
            codeReader.reset();
        };
    }, [willScan]);

    useEffect(() => {
        dispatch(setPage("qrscanner"));
    }, [dispatch]);

    useEffect(() => {
        const state = {
            error,
            torchOn,
            scannedData,
            modalOpen,
            manualModalOpen,
            willScan,
            message,
            addDisable,
            isCentered,
        };
        console.log("State:", state);
    }, [
        error,
        torchOn,
        scannedData,
        modalOpen,
        manualModalOpen,
        willScan,
        message,
        addDisable,
        isCentered,
    ]);

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

    const handleManualAdd = (manualData) => {
        setWillScan(false); // Stop scanning
        // stopCamera(); // Stop the camera and reset the video stream
        setManualModalOpen(true); // Open the manual modal
        setScannedData(manualData);

        // Check if the manually entered data already exists
        const isExisting = checkSerial({
            setAddDisable,
            setMessage,
            setModalOpen,
            eccId: manualData,
        }); // Implement this function to check for existing data
        if (isExisting) {
            setMessage("This ECC ID already exists.");
            setModalOpen(false); // Close the modal to prevent it from popping up
            setAddDisable(true); // Disable adding further
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
                    track.stop(); // Stop the camera track
                }
            });
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null; // Clear the video stream
        }

        console.log("Camera stopped");
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
                {error && (
                    <div className={qrScannerStyles.errorClass}>{error}</div>
                )}
                <video ref={videoRef} className={qrScannerStyles.videoClass} />
                <div className={qrScannerStyles.overlayContainerClass}>
                    <div className={qrScannerStyles.overlayClass}>
                        <div className={qrScannerStyles.overlayTopClass}></div>
                        <div
                            className={qrScannerStyles.overlayBottomClass}
                        ></div>
                        <div className={qrScannerStyles.overlayLeftClass}></div>
                        <div
                            className={qrScannerStyles.overlayRightClass}
                        ></div>
                        <div
                            className={qrScannerStyles.scannerAreaClass}
                            style={{
                                borderColor: isCentered ? "green" : "red", // Change border color based on centering check
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
                <div className="absolute xs:top-60 xs:text-sm text-white z-60">
                    {t("qrScanner:barcodePlaceCode")}
                </div>

                <button
                    className="absolute bottom-4 left-4 bg-white p-2 text-blue-500 rounded-full shadow-md"
                    onClick={toggleTorch}
                >
                    {torchOn ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                        >
                            {/* Torch On Icon */}
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                        >
                            {/* Torch Off Icon */}
                        </svg>
                    )}
                </button>
                <div className="absolute z-60 bottom-18 flex flex-col justify-center w-80">
                    <label className="text-white text-xs mb-2 text-center">
                        {t("qrScanner:cannotScanCode")}
                    </label>
                    <button
                        className="text-white text-sm p-3 border font-semibold border-white rounded-md"
                        onClick={() => setManualModalOpen(true)} // Open the manual modal
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
            />
        </div>
    );
};

export default QRScanner;
