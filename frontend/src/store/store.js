import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice";
import selectedChatSlice from "./selectedChat";
import chatsSlice from "./chatsSlice";
import notificationSlice from "./notificationSlice"

const store = configureStore({
    reducer:{
       userSlice : userSlice,
       selectedChatSlice: selectedChatSlice,
       chatsSlice : chatsSlice,
       notificationSlice : notificationSlice
    }
})

export default store;