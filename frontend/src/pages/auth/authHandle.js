import axiosInstance from "../../utils/axiosInstance";
import { login } from "./authSlice";

export const handleLogin = (data,navigate) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/login", data);
    dispatch(login(response.data.user))
    navigate('/')
  } catch (error) {
    console.log(error);
  }
};

export const handleRegister = (data) => async () => {
  try {
     await axiosInstance.post("/register", data);
  } catch (error) {
    console.log(error);
  }
};


