import { useNavigate } from "react-router-dom";
import axiosLib from "../lib/axios"
import { useCylinderCover } from "./cylinderCover";


export const useCylinderUpdate = () => {
    const csrf = () => axiosLib.get("/sanctum/csrf-cookie");
    const navigate = useNavigate();

    const addUpdate = async(input, status) => {
        const eccId = input.serialNumber;

        const updateData = {
            serialNumber : input.serialNumber,
            process : status,
            location : input.location,
            cycle : input.cycle,
            dateDone : input.dateDone ? input.dateDone : null,
            otherDetails : input.otherDetails ? input.otherDetails : null
        }

        await csrf();

        console.log(updateData)
        axiosLib
            .post("/api/cylinder-update", updateData)
            .then((res) => {
                console.log(res);
                navigate("/qrscanner")
            })
            .catch((error) => {
                if (error.response.status !== 422) throw error;
            })
    }

    return {
        addUpdate
    }
}