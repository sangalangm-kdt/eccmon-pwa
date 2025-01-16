/* eslint-disable no-unused-vars */
import axiosLib from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useScanHistory } from "./scanHistory";
import useSWR from "swr";
import { useAuthentication } from "./auth";

export const useCylinderCover = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");
  const navigate = useNavigate();
  const { addHistory } = useScanHistory();
  const { userId } = useAuthentication();

  const {
    data: cylinder,
    error,
    mutate,
  } = useSWR("/api/cylinder", () =>
    axiosLib
      .get("/api/cylinder")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
  );

  const checkSerial = async ({
    setAddDisable,
    setMessage,
    setModalOpen,
    ...props
  }) => {
    await csrf();

    axiosLib
      .get(`/api/cylinder/${props.eccId}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.data) {
          if (+res.data.data.isDisposed === 1) {
            setAddDisable(true);
            setMessage("Cylinder is already disposed");
            setModalOpen(true);
          } else {
            navigate("/scanned-result", { replace: true, state: res.data });
          }
        } else {
          setAddDisable(false);
          setMessage(
            "The cylinder cover does not exist. Do you want to add it?",
          );
          setModalOpen(true);
        }
        mutate();
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;
      });
  };

  const addCylinder = async (input) => {
    console.log(input);
    const data = {
      serialNumber: input,
      isDisposed: 2,
      status: "Storage",
      location: "None",
      userId: userId,
    };
    await csrf();

    axiosLib
      .post("/api/cylinder", data)
      .then((res) => {
        const data2 = {
          serialNumber: input,
          status: 2,
        };
        console.log(res);

        addHistory(data2);
        navigate("/scanned-result", { state: res.data });
        mutate();
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;
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

    axiosLib
      .put(`/api/cylinder/${id}`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      });
  };

  return {
    cylinder,
    checkSerial,
    addCylinder,
    updateCylinder,
  };
};
