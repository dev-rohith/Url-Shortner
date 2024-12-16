import { createSlice } from "@reduxjs/toolkit";

const userInitailState = localStorage.getItem("user")
  ? { isLoggedIn: true, user: JSON.parse(localStorage.getItem("user")) }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: "user",
  initialState: userInitailState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export default authSlice.reducer;

export const { login, logout } = authSlice.actions;
