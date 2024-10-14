import { createSlice } from "@reduxjs/toolkit";

const initialState={
    status: false,
    userData: null
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        login:(state, action)=>{
            state.userData = action.payload.userData;
            state.status = true;
        },
        logout:(state)=>{
            state.userData = null;
            state.status = false;
        }
    }
})

export default userSlice.reducer
export const {login, logout} = userSlice.actions