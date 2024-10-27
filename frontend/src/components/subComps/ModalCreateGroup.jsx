import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Box,
    useToast,
} from '@chakra-ui/react'

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import SearchedUser from './SearchedUser';
import UserBadgeItem from './UserBadgeItem';
import { unshiftChats } from '../../store/chatsSlice';


const ModalCreateGroup = ({ children }) => {
    const toast = useToast()
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [value, setValue] = useState()
    const [searchedUsers, setSearchedUsers] = useState()
    const [inputs, setInputs] = useState({
        groupName: "",
        users: []
    })
    const user = useSelector(state => state.userSlice.userData)


    const handleSearch = async (Value) => {
        setValue(Value)
        if (!Value) return;
        try {
            const response = await axios.get(`${window.location.origin}/api/user?search=${Value}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            setSearchedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }


    const handleAddUser = (user) => {
        if (inputs.users.includes(user)) {
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
        setInputs((prevInp) => ({
            ...prevInp,
            users: [...(prevInp.users || []), user]
        }))

    }
    const unSelectUser = (user) => {
        setInputs((prevInp) => ({
            ...prevInp,
            users: prevInp.users.filter((User) => User._id !== user._id)
        }))
    }
    const handleSubmit = async () => {
        if (!inputs.groupName || !inputs.users) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            const createdGroup = await axios.post(`${window.location.origin}/api/chat/group`, {
                chatName: inputs.groupName,
                users: JSON.stringify(inputs.users.map((u) => u._id))
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            })
            dispatch(unshiftChats({ chats: createdGroup.data }))

            onClose()
        } catch (error) {
            toast({
                title: "Group creation failed",
                description: "failed to create the group",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
        }
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            display={'flex'}
                            flexDirection={"column"}
                            gap={'4px'}
                        >
                            <input
                                type="text"
                                placeholder='Group name..'
                                style={{ padding: "6px" }}
                                value={inputs.groupName}
                                onChange={(e) => setInputs({ ...inputs, groupName: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder='Add Users'
                                style={{ padding: "6px" }}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </Box>
                        <Box
                        w={"100%"}
                        display={"flex"}
                        flexWrap={"wrap"}
                        >
                            {inputs.users && inputs.users.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => unSelectUser(user)} />
                            ))}
                        </Box>
                        {searchedUsers && searchedUsers.map((user) => (
                            <SearchedUser key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                        ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalCreateGroup
