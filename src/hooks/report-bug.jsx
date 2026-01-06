import { useNavigate } from "react-router-dom";
import axiosLib from "../lib/axios";
import useSWR from "swr";

export const useReportBug = () => {
  const csrf = () => axiosLib.get("/sanctum/csrf-cookie");

  //   const {
  //     data: reportBug,
  //     error,
  //     mutate,
  //   } = useSWR("/api/user-request", () =>
  //     axiosLib
  //       .get("/api/user-request")
  //       .then((res) => res.data)
  //       .catch((error) => {
  //         if (error.response.status !== 409) throw error;
  //       }),
  //   );

  const addReportBug = async ({ files, ...props }) => {
    await csrf();
    const formData = new FormData();
    files.forEach((image) => {
      formData.append("files[]", image.file); // Append each file properly
    });

    console.log("clicked", { ...props, formData });
    return axiosLib
      .post("/api/bug-report", { ...props, formData })
      .then((response) => {
        console.log("Upload successfully!");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 422) {
          console.log(error.response.data.message);
        } else {
          console.log(error.response.data.message);
        }
      });
  };

  return { addReportBug };
};
