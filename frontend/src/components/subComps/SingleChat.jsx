import { Box, Button, Spinner, Text, useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../store/selectedChat";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getFullSender, getSender } from "./ChatLogics";
import ProfileModel from '../subComps/ProfielModel'
import { EditGroupModel } from "../EditGroupModel";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css"
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client"
import { setNotification } from "../../store/notificationSlice";

const ENDPOINT = `${window.location.origin}`
var socket, selectedChatCompare;

const SingleChat = () => {
    const dispatch = useDispatch()
    const toast = useToast()
    const selectedChat = useSelector(state => state.selectedChatSlice.chat)
    const notification = useSelector(state => state.notificationSlice.notificationState)
    const chats = useSelector(state => state.chatsSlice.chats)
    const authUser = useSelector(state => state.userSlice.userData)

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            setNewMessage("")
            socket.emit("stop typing", selectedChat._id)
            try {
                const res = await axios.post(`${window.location.origin}/api/message`, {
                    chatId: selectedChat._id,
                    msg: newMessage
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authUser.token}`
                    }
                })
                socket.emit("new message", res.data)
                setMessages([...messages, res.data])
            }
            catch (error) {
                toast({
                    title: 'error',
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                })
            }
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const response = await axios.get(
                `${window.location.origin}/api/message/${selectedChat._id}`
                , {
                    headers: {
                        Authorization: `Bearer ${authUser.token}`
                    }
                })
            setMessages(response.data)
            setLoading(false)

            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: 'error',
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
        }
    }

    const sendMessageHandler = async () => {
        socket.emit("stop typing", selectedChat._id)
        try {
            const res = await axios.post(`${window.location.origin}/api/message`, {
                chatId: selectedChat._id,
                msg: newMessage
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`
                }
            })
            socket.emit("new message", res.data)
            setMessages([...messages, res.data])
        }
        catch (error) {
            toast({
                title: 'error',
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
        }
    }


    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", authUser)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    // useEffect(() => {
    //     socket.on("msgRecieved", (newMessageRecieved) => {
    //         if (
    //             !selectedChatCompare ||
    //             selectedChatCompare._id !== newMessageRecieved.chat._id
    //         ) {
    //             if (!notification.includes(newMessageRecieved)) {
    //                 dispatch(setNotification({ notification: newMessageRecieved }))
    //             }
    //         } else {
    //             setMessages([...messages, newMessageRecieved]);
    //         }
    //     });
    // }, [selectedChatCompare, notification, dispatch]);

    useEffect(() => {
        socket.on("msgRecieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || 
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    dispatch(setNotification({ notification: newMessageRecieved }));
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
            }
        });
        return () => {
            socket.off("msgRecieved");
        };
    }, [selectedChatCompare, notification, dispatch]); 



    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }
    return (
        <>
            {selectedChat
                ? (
                    <Box
                        width={"100%"}
                        height={"100%"}
                        overflowY={"hidden"}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            flexDirection="row"
                            width={"100%"}
                            height={"50px"}
                            padding={0}
                            alignItems={'center'}
                            bgColor={"black"}
                            px={"12px"}
                            borderRadius={'10px'}
                        >
                            <Button
                                onClick={() => dispatch(setSelectedChat({ chat: "" }))}
                                p={'0px'}
                                display={{ base: 'flex', md: "none" }}
                                fontSize={'24px'}
                            >
                                <IoMdArrowRoundBack />
                            </Button>
                            <Text fontSize={'24'}>
                                {!selectedChat.groupChat ? getSender(authUser, selectedChat.users) : (selectedChat.chatName)}
                            </Text>
                            {!selectedChat.groupChat ? <ProfileModel user={getFullSender(authUser, selectedChat.users)} /> : (<EditGroupModel edit={"Edit"} fetchMessages={fetchMessages} />)}
                        </Box>

                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'flex-end'}
                            flexGrow={1}
                            width={"100%"}
                            height={{ base: "calc(100% - 80px)", sm: "calc(100% - 37px)" }}
                            borderRadius={"10px"}
                        >

                            {loading ? (
                                <Spinner
                                    size={'lg'}
                                    w={20}
                                    h={20}
                                    alignSelf={"center"}
                                    margin={"auto"}
                                />
                            ) : (
                                <Box
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'flex-end'}
                                    my={'10px'}
                                    w={"100%"}
                                    h={"100%"}
                                    overflowY={'hidden'}
                                    bgColor={'black'}
                                    color={'white'}
                                    borderRadius={"10px"}
                                >
                                    <div className="messages">
                                        <ScrollableChats messages={messages} />
                                    </div>
                                    <Box width={"100%"}>
                                        {isTyping ? <div style={{ backgroundColor: 'white', color: "black", marginLeft: "15px", margin: "4px", padding: "4px", width: "80px", borderRadius: "10px" }}>...typing</div> : <></>}
                                        <Box width={"100%"} display={'flex'} justifyContent={'center'} alignItems={"center"}>
                                            <input
                                                type="text"
                                                required
                                                value={newMessage}
                                                onChange={typingHandler}
                                                onKeyDown={sendMessage}
                                                className="input"
                                                placeholder="Enter a message..."
                                                style={{ width: "85%", padding: "10px", borderRadius: "15px", marginTop: "4px", marginBottom: "7px", maxWidth: "600px", marginLeft: "2px", border: "none" }}
                                            />
                                            <button onClick={sendMessageHandler} style={{ marginLeft: "5px", backgroundColor: "white", color: "black", fontWeight: "500", padding: "10px", borderRadius: "15px", marginTop: "4px", marginBottom: "7px", marginRight: "2px" }}>send</button>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                        </Box>

                    </Box>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%" width={"100%"}>
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )}
        </>
    )
}

export default SingleChat;