import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, useToast, } from "@chakra-ui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import UserBadgeItem from "./subComps/UserBadgeItem"
import axios from "axios"
import SearchedUser from "./subComps/SearchedUser"
import { setGroupName, setSelectedChat } from "../store/selectedChat"
import { updateGroupName } from "../store/chatsSlice"
import { removeChat } from "../store/chatsSlice"

export const EditGroupModel = ({ edit, fetchMessages}) => {
    const toast = useToast()
    const dispatch = useDispatch()
    const selectedChat = useSelector(state => state.selectedChatSlice.chat)
    const chat = useSelector(state => state.chatsSlice.chats)
    const authUser = useSelector(state => state.userSlice.userData)
    const [searchedUsers, setSearchedUsers] = useState()
    const [groupChatState, setGroupChatState] = useState({
        groupName: selectedChat.chatName,
        users: selectedChat.users
    })
    const { isOpen, onOpen, onClose } = useDisclosure()
    // console.log(groupChatState)
    // console.log(authUser)


    const removeUser = async (User) => {
        if (authUser._id !== selectedChat.groupAdmin._id ) {
            toast({
                title: "Cannot remove User",
                description: "Only admins are allowed to remove user from group chat",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            })
            return;
        }
        if (authUser._id == User._id) return
        try {
            const res = await axios.put(`${window.location.origin}/api/chat/removeuser`, {
                chatId: selectedChat._id,
                userId: User._id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`
                }
            })
            setGroupChatState((prev) => ({
                ...prev,
                users: prev.users.filter((user) => user !== User)
            }))
            fetchMessages();
        } catch (error) {

        }        
    }

    const searchUserHandler = async (value) => {
        if (!value) return;
        const response = await axios.get(`${window.location.origin}/api/user?search=${value}`, {
            headers: {
                Authorization: `Bearer ${authUser.token}`
            }
        })
        setSearchedUsers(response.data)
    }

    // console.log("chat", selectedChat)
    // console.log("admin" , selectedChat.groupAdmin._id)

    const addUserHandler = async (user) => {
        if (authUser._id !== selectedChat.groupAdmin._id) {
            toast({
                title: "you are not admin",
                description: "only admin can add the user",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return
        }
        if (groupChatState.users.includes(user)) {
            toast({
                title: "User exist",
                description: "user exist or already added",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            })
            return;
        }
        try {
            const res = await axios.put(`${window.location.origin}/api/chat/adduser`, {
                chatId: selectedChat._id,
                userId: user._id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`
                }
            })
            setGroupChatState((prev) => ({
                ...prev,
                users: [...(prev.users || []), user]
            }))
            toast({
                title: 'User added',
                description: "User added successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleRename = async () => {
        if (authUser._id !== selectedChat.groupAdmin._id) {
            toast({
                title: 'You are not admin',
                description: "Only group admin can rename the group chat name",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return
        }
        if (!groupChatState.groupName) {
            toast({
                title: 'Value can not be enter',
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return
        }
        try {
            const res = await axios.put(`${window.location.origin}/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatState.groupName
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`
                }
            })
            dispatch(setGroupName({ chatName: res.data.chatName }))
            dispatch(updateGroupName({ chatId: selectedChat._id, newChatGroupName: res.data.chatName }))
            toast({
                title: 'Rename successfull',
                description: "Group chat name is changed successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            onClose()
        } catch (error) {
            console.log(error)
        } finally{
            (onClose)
        }
    }


    const leaveHandler = async()=>{
        const res = await axios.put(`${window.location.origin}/api/chat/removeuser`, {
            chatId : selectedChat._id,
            userId : authUser._id
        }, {
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${authUser.token}`
            }
        })
        onClose()
        dispatch(removeChat({chatId : selectedChat._id}))
        dispatch(setSelectedChat(""))
    }
    // console.log(selectedChat.chat.chatName)
    // console.log("called dispatch")
    // console.log(chat)

    return (
        <Box>
            <Button onClick={onOpen}>{edit}</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px"
                        display="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" flexWrap="wrap" pb={3} width={"100%"}>
                            {groupChatState && groupChatState.users.map((User) => (
                                <UserBadgeItem key={User._id} user={User} handleFunction={() => removeUser(User)} />
                            ))}
                        </Box>
                        <Box
                            width={"100%"}
                            display={"flex"}
                            justifyContent={"space-between"}
                            gap={'9px'}
                        >
                            <input
                                value={groupChatState.groupName}
                                onChange={(e) => setGroupChatState({ ...groupChatState, groupName: e.target.value })}
                                type="text"
                                placeholder="Enter group name"
                                style={{ width: '100%', borderRadius: "9px", paddingLeft: "10px", padding: "10px" }}
                            />
                        </Box>
                        <Box my={"9px"}>
                            <input
                                type="text"
                                placeholder="search user"
                                onChange={(e) => searchUserHandler(e.target.value)}
                                style={{ width: '100%', borderRadius: "9px", paddingLeft: "10px", padding: "10px" }}
                            />
                            {searchedUsers && searchedUsers.map((user) => (
                                <SearchedUser key={user._id} user={user} handleFunction={() => addUserHandler(user)} />
                            ))}
                        </Box>

                    </ModalBody>

                    <ModalFooter>
                        <Box display={"flex"} width={"100%"} justifyContent={"space-between"}>
                            <Button onClick={leaveHandler} bgColor={"red"}>Leave</Button>
                            <Button colorScheme='blue' onClick={handleRename}>
                                Update Name
                            </Button>
                        </Box>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}