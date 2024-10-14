import { Box } from '@chakra-ui/react'
import Sidedrawer from "../components/Sidedrawer"
import MyChat from '../components/MyChat'
import ChatBox from '../components/ChatBox'

const Chat = () => {
  return (
    <div style={{ width: "100%" }}>
      <Sidedrawer />
      <Box
        display="flex"
        justifyContent="space-between"
        w={"100%"}
        h={"91.5vh"}
        p={'7px'}
      >
        <MyChat />
        <ChatBox />
      </Box>
    </div>
  )
}

export default Chat
