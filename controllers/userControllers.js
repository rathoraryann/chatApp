const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

const registerUser = async(req, res)=>{
    const {name, email, password, pic} = req.body;
    
    const userExist = await User.findOne({email})
    if (userExist) {
        res.json({msg: "user exists"})
        return;
    }

    try {
        const user = await User.create({name, email, password, pic})
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: jwt.sign({id: user._id}, "passwordKey")
            })
        }
    } catch (error) {
        res.json({error})
    }
}

const authUser = async(req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id : user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: jwt.sign({id: user._id}, "passwordKey")
        })
    }else{
        res.status(200).json({
            msg: "user is not found"
        })
    }
}

const searchUser = async(req,res)=>{
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}}
        ]
    } : {}

    const searchedUser = await User.find(keyword).find({_id: {$ne: req.user._id}}).select("-password")
    res.send(searchedUser)
}

module.exports = {registerUser, authUser, searchUser}