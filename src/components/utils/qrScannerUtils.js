export const initializeScanner = (
  codeReader,
  videoRef,
  handleScanResult,
  setIsCentered,
) => {
  let selectedDeviceId;
  return new Promise((resolve, reject) => {
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
          setIsCentered(
            isAreaInCenter({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 }),
          );
          resolve();
        } else {
          reject(new Error("No back camera found"));
        }
      })
      .catch((err) => reject(err));
  });
};

export const handleScanResult = (
  result,
  err,
  setError,
  setScannedData,
  codeReader,
  setWillScan,
  modalOpen,
  checkSerial,
  setAddDisable,
  setMessage,
) => {
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
        checkSerial({ setAddDisable, setMessage, setModalOpen, eccId });
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

export const isAreaInCenter = (area) => {
  const { x, y, width, height } = area;
  const tolerance = 0.05;

  const isCenteredHorizontally = x >= 0.5 - tolerance && x <= 0.5 + tolerance;
  const isCenteredVertically = y >= 0.5 - tolerance && y <= 0.5 + tolerance;
  const isReasonablySized =
    width >= 0.1 && width <= 0.8 && height >= 0.1 && height <= 0.8;

  return isCenteredHorizontally && isCenteredVertically && isReasonablySized;
};

export const toggleTorch = (videoRef, torchOn, setTorchOn) => {
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

export const handleManualAdd = (
  manualData,
  checkSerial,
  setAddDisable,
  setMessage,
  setModalOpen,
) => {
  const isExisting = checkSerial({
    setAddDisable,
    setMessage,
    setModalOpen,
    eccId: manualData,
  });

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
