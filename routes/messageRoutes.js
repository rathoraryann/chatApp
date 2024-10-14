const express = require("express")
const {authMiddleware} = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controllers/messageControllers");
const router = express.Router()

router.post('/', authMiddleware, sendMessage)
router.get('/:chatId', authMiddleware, allMessages)

module.exports = router;