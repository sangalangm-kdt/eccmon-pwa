import axiosLib from "../lib/axios";
import { useAuthentication } from "./auth"


export const useScanHistory = () => {
    const {user} = useAuthentication();

    const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

    const addHistory = async (input) => {
        const data = {
            "serialNumber" : input.serialNumber,
            "userId" : user?.id,
            "status" : input.status,
        }
        console.log(data);

        await csrf();

        axiosLib
            .post("/api/scan-history", data)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                if (error.response.status !== 422) throw error;
            })
    }

    return {
        addHistory
    }
}