import axiosLib from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useScanHistory } from "./scanHistory";
import useSWR from "swr";
import { useAuthentication } from "./auth";
import { mapBackendMessage } from "../components/pages/_tabs/qrscanner/errorMessages";

export const useCylinderCover = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");
  const navigate = useNavigate();
  const { addHistory } = useScanHistory();
  const { userId } = useAuthentication();

  const {
    data: cylinder,
    error,
    mutate,
  } = useSWR(
    "/api/cylinder",
    () =>
      axiosLib
        .get("/api/cylinder")
        .then((res) => res.data)
        .catch((error) => {
          const status = error?.response?.status;

          // if it's 409, ignore (your original logic)
          if (status === 409) return;

          // if no response => network/CORS/offline
          if (!status) {
            console.error("Network / CORS error:", error);
            return;
          }

          throw error;
        }),
    { revalidateOnFocus: false },
  );

  const checkSerial = async ({
    t,
    setAddDisable,
    setMessage,
    setSeverity,
    setModalOpen,
    ...props
  }) => {
    await csrf();

    return axiosLib
      .get(`/api/cylinder/${props.eccId}`)
      .then((res) => {
        if (res?.data?.data) {
          if (+res.data.data.isDisposed === 1) {
            const mapped = mapBackendMessage(t, "Cylinder is already disposed");
            setAddDisable(true);
            setSeverity?.(mapped.severity);
            setMessage(mapped.text);
            setModalOpen(true);
          } else {
            navigate("/scanned-result", { replace: true, state: res.data });
          }
        } else {
          const mapped = mapBackendMessage(
            t,
            "The cylinder cover does not exist. Do you want to add it?",
          );
          setAddDisable(false);
          setSeverity?.(mapped.severity);
          setMessage(mapped.text);
          setModalOpen(true);
        }
        mutate();
      })
      .catch((error) => {
        const status = error?.response?.status;

        if (status === 422) return;

        if (!status) {
          const mapped = mapBackendMessage(
            t,
            "Network error. Please check your connection and try again.",
          );
          setAddDisable(true);
          setSeverity?.(mapped.severity);
          setMessage(mapped.text);
          setModalOpen(true);
          return;
        }

        throw error;
      });
  };
  const addCylinder = async (input) => {
    const data = {
      serialNumber: input,
      isDisposed: 2,
      status: "Storage",
      location: "None",
      userId: userId,
    };

    await csrf();

    return axiosLib
      .post("/api/cylinder", data)
      .then((res) => {
        addHistory({ serialNumber: input, status: 2 });
        navigate("/scanned-result", { state: res.data });
        mutate();
      })
      .catch((error) => {
        const status = error?.response?.status;

        if (status === 422) return;
        if (!status) {
          console.error("Network / CORS error:", error);
          return;
        }

        throw error;
      });
  };

  const updateCylinder = async (input) => {
    const data = {
      serialNumber: input.serialNumber,
      isDisposed: input.isDisposed,
      status: input.status,
      cycle: input.cycle,
    };

    const id = input.id;

    await csrf();

    return axiosLib
      .put(`/api/cylinder/${id}`, data)
      .then((res) => res.data)
      .catch((error) => {
        const status = error?.response?.status;

        if (status === 409) return;
        if (!status) {
          console.error("Network / CORS error:", error);
          return;
        }

        throw error;
      });
  };

  return { cylinder, checkSerial, addCylinder, updateCylinder };
};
