import { Avatar, Box, Button, Image, Text, useDisclosure } from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure
    ()
  return (
    <>
      {children ? <Box onClick={onOpen}>{children}</Box> : <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} onClick={onOpen} />}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={'410px'}>
          <ModalHeader
            display={'flex'}
            justifyContent={'center'}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Image src={user.pic} borderRadius={'full'} boxSize={"150px"} alt={user.name} />
            <Text>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel