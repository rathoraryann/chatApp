import {createSlice} from '@reduxjs/toolkit'

const selectedChatSlice = createSlice({
    name: 'selectedChatSlice',
    initialState : {
        chat: null
    },
    reducers : {
        setSelectedChat : (state, action)=>{
            state.chat = action.payload.chat;
        },
        setGroupName : (state, action)=>{
            state.chat.chatName = action.payload.chatName
        }
    }
})

export default selectedChatSlice.reducer
export const {setSelectedChat, setGroupName} = selectedChatSlice.actions