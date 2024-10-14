const Chat = require("../models/chatModel")
const User = require("../models/userModel")

const accessChat = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("userId param is not sent with req")
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        groupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password")
        .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0])
    }
     else {
        var chatData = {
            chatName: req.user.name,
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password")

            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    }
}

const fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                })

                res.status(200).send(result);
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
}


const createGroupChat = async (req, res) => {
    if (!req.body.chatName || !req.body.users) {
        return res.status(400).json({
            msg: "fields should be filled"
        })
    }

    var users = await JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send("more than 2 members are required for group")
    }

    users.push(req.user)

    try {


        const groupChat = await Chat.create({
            chatName: req.body.chatName,
            groupChat: true,
            users: users,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if(!updateChat){
        res.status(400)
        throw new Error('Chat not found')
    }else{
        res.json(updateChat);
    }
}

const addUser = async(req, res) =>{
    const {userId, chatId} = req.body;

    const addUserInGroup = await Chat.findByIdAndUpdate(chatId, {
        $push : { users: userId}
    }, {
        new : true
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if (addUserInGroup) {
        res.status(200).json(addUserInGroup)
    }else{
        res.status(400)
        throw new Error("user is not added")
    }
}

const removeUser = async(req, res) =>{
    const {chatId, userId} = req.body;

    const removedUser = await Chat.findByIdAndUpdate(chatId, {
        $pull: {users: userId}
    },{
        new : true
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if (removedUser) {
        res.status(200).json(removedUser)
    }else{
        res.status(400)
        throw new Error("user is not remove ")
    }
}
module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addUser, removeUser}