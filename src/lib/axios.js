import Axios from "axios";

const axiosLib = Axios.create({
  baseURL: "https://api.eccmon.site",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default axiosLib;
