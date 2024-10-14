import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
    name: "notificationSlice",
    initialState: {
        notificationState: []
    },
    reducers: {
        setNotification : (state, action)=>{
            state.notificationState = [action.payload.notification, ...state.notificationState]
        }
    }
})

export default notificationSlice.reducer;
export const {setNotification} = notificationSlice.actions;