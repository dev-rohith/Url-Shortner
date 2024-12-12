import { createSlice } from "@reduxjs/toolkit";

const userInitailState = {
    isLoggedIn: false,
    user: null
}

const authSlice = createSlice({
    name: 'user',
    initialState: userInitailState,
    reducers : {
       login (state,action){
         state.isLoggedIn = true;
         state.user = action.payload;
       },
       logout (state){
         state.isLoggedIn = false, state.user = null;
       },

    }
})

export default authSlice.reducer

export const {login, logout} = authSlice.actions






