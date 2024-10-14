import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react"
import { IoMdAdd } from "react-icons/io";

import { getSender } from "./subComps/ChatLogics";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setChats } from '../store/chatsSlice'
import { setSelectedChat } from "../store/selectedChat";
import { useEffect } from "react"
import ChatLoading from "./subComps/ChatLoading";
import ModalCreateGroup from "./subComps/ModalCreateGroup";


const MyChat = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const user = useSelector(state => state.userSlice.userData)
    const chats = useSelector(state => state.chatsSlice)
    const selectedChat = useSelector(state => state.selectedChatSlice.chat)
    const fetchChat = async () => {
        try {
            const response = await axios.get(`${window.location.origin}/api/chat`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            })
            dispatch(setChats({ chats: response.data }))
        } catch (error) {
            toast({
                title: 'error',
                description: 'error',
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-right"
            })
        }
    }

    // console.log("chats.chats", chats.chats)
    // console.log("chats", chats)
    // console.log("selectedChat", selectedChat)

    useEffect(() => {
        fetchChat()
    }, [])

    // console.log(chats)



    return (
        <Box
            display={{ base: selectedChat ? "none" : 'flex', md: "flex" }}
            flexDirection={"column"}
            alignItems={"center"}
            p={"3px"}
            w={{ base: '100%', md: '30%' }}
            borderRadius={"10px"}
            borderWidth={{sm: "1px"}}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "27px", md: "31px" }}
                fontFamily={"sans-serif"}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                My chat
                <ModalCreateGroup>
                    <Button
                        display={"flex"}
                        fontSize={{ base: "12px", md: "7px", lg: "13px" }}
                        rightIcon={<IoMdAdd fontSize={'19px'} />}
                        >New Group Chat
                    </Button>
                </ModalCreateGroup>
            </Box>
            <Box
                display={'flex'}
                flexDirection={"column"}
                p={"3px"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {/*  chats.chats for array bcz selector is returning object which is stored in const chats defined in myChat, which contain and chats array [see the line 40 and 41 for the difference]  */}
                {chats.chats ? (
                    <Stack overflowY={"scroll"} width={"100%"} height={"100%"} padding={0}>
                        {chats.chats.map((chat) => (
                            <Box
                                onClick={() => dispatch(setSelectedChat({ chat: chat }))}
                                cursor={'pointer'}
                                bgColor={selectedChat === chat ? 'white' : "black"}
                                color={selectedChat === chat ? "black" : "lightgray"}
                                px={3}
                                py={2}
                                borderRadius={'lg'}
                                key={chat._id}
                                paddingX={'1px'}

                            >
                                <Text px={'12px'} fontSize={{base: "15px", sm: "19px"}}>{!chat.groupChat ? getSender(user, chat.users) : (chat.chatName)}</Text>
                            </Box>
                        ))}
                    </Stack>)
                    : (<ChatLoading />)}
            </Box>
        </Box>)
}

export default MyChat