const router = require("express").Router();
const { registerUser, authUser, searchUser} = require("../controllers/userControllers");
const {authMiddleware} = require("../middleware/authMiddleware");

router.get("/", authMiddleware, searchUser)
router.post('/auth', registerUser)
router.post('/login', authUser)

module.exports = router;