const router = require("express").Router() 
const { accessChat, fetchChats, createGroupChat, renameGroup, addUser, removeUser } = require("../controllers/chatControllers");
const {authMiddleware} = require("../middleware/authMiddleware")

router.post("/", authMiddleware, accessChat)
router.get("/", authMiddleware, fetchChats)
router.post("/group", authMiddleware, createGroupChat)
router.put("/rename", authMiddleware, renameGroup)
router.put("/adduser", authMiddleware, addUser)
router.put("/removeuser", authMiddleware, removeUser)

module.exports = router;