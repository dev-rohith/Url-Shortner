import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/authSlice";

const store = configureStore({
    reducer: {
      user: authReducer
    }
})

export default store