import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react"

import { useSelector } from "react-redux"
import SingleChat from "./subComps/SingleChat"

const ChatBox = () => {
    const selectedChat = useSelector(state => state.selectedChatSlice.chat)
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            // alignItems="center"
            // flexDirection="column"
            p={"3px"}
            w={{ base: "100%", md: "68%" }}
            borderRadius="10px"
            borderWidth={{sm: "1px"}}
        >
            <SingleChat />
        </Box>)
}

export default ChatBox