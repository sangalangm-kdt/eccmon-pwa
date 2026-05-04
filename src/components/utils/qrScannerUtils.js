import { useEffect } from "react";
import { BrowserMultiFormatReader, BarcodeFormat, NotFoundException } from "@zxing/library";

// Initialize code reader globally to avoid multiple initializations
const codeReader = new BrowserMultiFormatReader();

export const isAreaInCenter = (area) => {
  // Example logic for checking if the scan area is centered
  const { x, y, width, height } = area;
  const areaCenterX = x + width / 2;
  const areaCenterY = y + height / 2;

  // Assuming the video feed's center is at (0.5, 0.5)
  const videoFeedCenterX = 0.5;
  const videoFeedCenterY = 0.5;

  // Check if the scan area center is close to the video feed center
  return (
    Math.abs(areaCenterX - videoFeedCenterX) < 0.05 &&
    Math.abs(areaCenterY - videoFeedCenterY) < 0.05
  );
};
// Utility function for handling scan result
export const handleScanResult = (
  result,
  err,
  setError,
  setScannedData,
  setWillScan,
  setModalOpen,
  checkSerial,
  videoRef,
   setAddDisable,  // Add this parameter
  setMessage 
) => {
  if (result) {
    try {
      const jsonData = JSON.parse(result.text);
      const eccId = jsonData.eccId;

      if (!eccId) {
        setError("The scanned code does not contain a valid code.");
        return;
      }

      if (!setModalOpen) {
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
// Utility function for handling camera switching
export const handleSwitchCamera = (currentCamera, setCameraSwitched, setCurrentCamera) => {
  setCurrentCamera((prevCamera) => {
    const newCamera = prevCamera === "back" ? "front" : "back";
    setCameraSwitched(true);

    setTimeout(() => {
      setCameraSwitched(false);
    }, 2000);

    return newCamera;
  });
};

// Function to stop the camera
export const stopCamera = (videoRef) => {
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



// Function to start scanning
export const startScan = (
  willScan,
  videoRef,
  currentCamera,
  setWillScan,
  setError,
  setIsCentered,
  checkSerial,
  setScannedData,
  setModalOpen
) => {
  if (!willScan) {
    stopCamera(videoRef);
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

        if (currentCamera === "back" && backCamera) {
          selectedDeviceId = backCamera.deviceId;
        } else if (currentCamera === "front" && frontCamera) {
          selectedDeviceId = frontCamera.deviceId;
        }

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) =>
            handleScanResult(result, err, setError, setScannedData, setWillScan, setModalOpen, checkSerial, videoRef),
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
};

