import { configureStore } from "@reduxjs/toolkit";

import authReducer from '../pages/auth/authSlice'

const store = configureStore({
    reducer: {
      user: authReducer
    }
})

export default store