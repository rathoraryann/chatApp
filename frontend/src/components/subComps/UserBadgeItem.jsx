import { IoCloseSharp } from "react-icons/io5";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
      display={"flex"}
      justifyContent={"center"}
      alignItems={'center'}
      gap={'5px'}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <IoCloseSharp pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;