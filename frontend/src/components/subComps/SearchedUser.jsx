import { Box, Text, Avatar, } from '@chakra-ui/react'
const SearchedUser = ({user, handleFunction}) =>{
    return (
        <>
        <Box
        onClick={handleFunction}
        display={'flex'} 
        alignItems={'center'}
        bgColor={"lightgray"}
        padding={'5px'}
        borderRadius={'10px'}
        m={'5px'}
        >
            <Avatar src={user.pic} name={user.name} mr={2} cursor={"pointer"}/>
            <Box display={"flex"} flexDirection={'column'}>
                <Text>{user.name}</Text>
                <Text><b>Email : </b>{user.email}</Text>
            </Box>
        </Box>
        </>
    )
}

export default SearchedUser;