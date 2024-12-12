import axios from "axios";

function axiosInstance() {
  return axios.create({
    baseURL: "localhost:3000/api/",
    headers: {
        withCredentials:true
    }
  });
}
export default axiosInstance;
