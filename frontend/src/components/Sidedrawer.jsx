import { Box, Button, Input, MenuItem, MenuList, Text, Tooltip, useDisclosure, Avatar, Menu, MenuButton, useToast, position } from '@chakra-ui/react'
import { IoSearch } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import ProfileModel from "./subComps/ProfielModel";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

import { useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import {setSelectedChat} from "../store/selectedChat"
import SearchedUser from "./subComps/SearchedUser";
import { unshiftChats } from '../store/chatsSlice';
import { getSender } from './subComps/ChatLogics';
import { setNotification } from '../store/notificationSlice';

const Sidedrawer = () => {
    const toast = useToast()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const user = useSelector(state => state.userSlice.userData)
    const notification = useSelector(state => state.notificationSlice.notificationState)
    const usersChat = useSelector(state =>state.selectedChatSlice.chat)
    const userChats = useSelector(state =>state.chatsSlice.chats)
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    // const [loading, setLoading] = useState(false)
    // const [loadingChat, setLoadingChat] = useState()



    const logoutHandler = () => {
        localStorage.removeItem("user-info")
        dispatch(logout())
        navigate("/")
    }
    const searchUserHandler = async () => {
        if (!search) {
            toast({
                title: 'Empty fields',
                description: "please enter the user",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-left"
            })
            return;
        }
        const searchedUsers = await axios.get(`${window.location.origin}/api/user?search=${search}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        setSearchResult(searchedUsers.data)
    }
    const accessChat = async(userId) => {
        try {
            const response = await axios.post(`${window.location.origin}/api/chat`, {userId}, {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            })
            if (!userChats.find(c=>c._id==response.data._id)) dispatch(unshiftChats({chats: response.data}))
            dispatch(setSelectedChat({chat: response.data}))
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: "3000",
                isClosable: "true",
                position: "bottom-left"
            })
        }      
    }    
    //  console.log("chat" , usersChat)

    // console.log(notification)


    return (
        <Box
            display="flex"
            justifyContent={"space-between"}
            alignItems={"center"}
            bg={'black'}
            w={"100%"}
            py={"10px"}
            borderRadius={'10px'}
        >
            <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
                <Button variant="ghost" leftIcon={<IoSearch fontSize="23px" />} onClick={onOpen}>
                    <Text px="5px" display={{ base: "none", md: "flex" }}>Search user</Text>
                </Button>
            </Tooltip>


            <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
                Chat App
            </Text>

            <div style={{ justifyContent: "center", display: "flex" }}>
                <Menu>
                    <MenuButton p={1}>
                        <IoMdNotifications fontSize={'23px'} />
                    </MenuButton>
                    {/* <MenuList pl={2}>
                        {!notification.length && "No new message"}
                        {notification.map((notific) =>(
                            <MenuItem key={notific._id}
                            onClick={()=>{
                                dispatch(setSelectedChat({chat: notific.chat}))
                                dispatch(setNotification({notification: null}))
                            }}
                            >
                                {notific.chat.groupChat? `New message in ${notific.chat.chatName}`: `New message `}
                                {console.log(notific.chat)}
                            </MenuItem>
                        ))}
                    </MenuList> */}
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<MdKeyboardArrowDown />}>
                        <Avatar size={'xs'} cursor={'pointer'} name={user.name} src={user.pic} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            <ProfileModel user={user}>
                                My Profile
                            </ProfileModel>
                        </MenuItem>
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search user</DrawerHeader>


                    <DrawerBody
                        display={'flex'}
                        flexDirection={'column'}
                    >
                        <Box display={'flex'} gap={'5px'}>
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search user to chat...' />
                            <Button variant="ghost" bgColor={'lightgray'} leftIcon={<IoSearch fontSize="23px" />} onClick={searchUserHandler} />
                        </Box>

                        <Box
                            display={"flex"}
                            flexDirection={'column'}
                            gap={'5px'}
                            my={'10px'}
                            mx={"4px"}
                        >
                            {searchResult.map((value) => (
                                <SearchedUser
                                    key={value._id}
                                    user={value}
                                    handleFunction={()=>accessChat(value._id)}
                                />
                            ))}
                        </Box>

                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>)
}

export default Sidedrawer