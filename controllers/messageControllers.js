const Message = require("../models/messageModel")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")

const sendMessage = async (req, res) => {
    const { msg, chatId } = req.body;
    if (!msg || !chatId) {
        console.log("error something empty")
        return
    }

    try {
        var message = await Message.create({ sender: req.user._id, chat: chatId, content: msg })
        message = await message.populate("sender", "-password")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chats.users",
            select: "name pic email"
        })
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        })
        res.json(message)
    } catch (error) {
        throw new Error(error.message)
    }
}

const allMessages = async (req, res) =>{
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name pic email").populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

module.exports = { sendMessage , allMessages}