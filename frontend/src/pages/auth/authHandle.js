import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { login } from "./authSlice";

export const handleLogin = (data, navigate) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/login", data);
    dispatch(login(response.data.user));
    navigate("/");
    toast("logged in successfully");
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const handleRegister = (data) => async () => {
  try {
    await axiosInstance.post("/register", data);
    toast("registered successfully now you can login");
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
