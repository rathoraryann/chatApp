import {createSlice} from "@reduxjs/toolkit"

const chatsSlice = createSlice({
    name: "chatsSlice",
    initialState: {
        chats : null
    },
    reducers: {
        setChats : (state, action)=>{
            state.chats = action.payload.chats
        },
        unshiftChats: (state, action)=>{
            state.chats = [action.payload.chats, ...state.chats]
        },
        updateGroupName : (state, action)=>{
            const {chatId, newChatGroupName} = action.payload;
            const chatToUpdate = state.chats.find(chat=> chat._id == chatId)
            if (chatToUpdate) chatToUpdate.chatName = newChatGroupName;
        },
        removeChat : (state, action) =>{
            const {chatId} = action.payload;
            state.chats = state.chats.filter((chat)=> chat._id !==chatId)
        }
        
    }
})

export default chatsSlice.reducer;
export const {setChats, unshiftChats, updateGroupName, removeChat} = chatsSlice.actions