/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import axiosLib from "../lib/axios";
import { useCylinderCover } from "./cylinderCover";
import useSWR from "swr";
import { useAuthentication } from "./auth";

export const useCylinderUpdate = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");
  //   const navigate = useNavigate();
  const { userId } = useAuthentication();

  const {
    data: cylinder,
    error,
    mutate,
  } = useSWR("/api/cylinder-update", () =>
    axiosLib
      .get("/api/cylinder-update")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      }),
  );

  const addUpdate = async (input, status) => {
    const eccId = input.serialNumber;

    const updateData = {
      serialNumber: input.serialNumber,
      process: status,
      location: input.location,
      cycle: input.cycle,
      dateDone: input.dateDone ? input.dateDone : null,
      otherDetails: input.otherDetails ? input.otherDetails : null,
      userId: userId,
    };

    await csrf();

    console.log(updateData);
    axiosLib
      .post("/api/cylinder-update", updateData)
      .then((res) => {
        console.log(res);
        // navigate("/qrscanner");
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;
      });
  };

  return {
    addUpdate,
    cylinder,
    mutate,
  };
};
