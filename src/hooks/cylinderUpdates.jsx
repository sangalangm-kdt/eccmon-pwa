import axiosLib from "../lib/axios"


export const useCylinderUpdate = () => {
    const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

    const addUpdate = async(input) => {
        const updateData = {
            serialNumber : input.serialNumber,
            process : input.process,
            location : input.location,
            cycle : input.cycle,
            otherDetails : input.otherDetails,
        }

        await csrf();

        axiosLib
            .post("/api/cylinder-update", updateData)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                if (error.response.status !== 422) throw error;
            })
    }

    return {
        addUpdate
    }
}