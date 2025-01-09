import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  NotFoundException,
} from "@zxing/library";

const codeReader = new BrowserMultiFormatReader();

export const initializeScanner = ({
  videoRef,
  setError,
  setScannedData,
  setWillScan,
  setModalOpen,
  checkSerial,
  setMessage,
  setAddDisable,
}) => {
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

                setScannedData(eccId);
                codeReader.reset();
              } catch (e) {
                setError("Invalid JSON data. Please check the QR code.");
              }
            }

            if (err && !(err instanceof NotFoundException)) {
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
      setError(
        "Error accessing video devices. Please check your camera permissions.",
      );
    });
};

export const stopScanner = () => {
  codeReader.reset();
};
