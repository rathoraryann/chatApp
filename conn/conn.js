const mongoose = require("mongoose")

const conn = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log("Error in mongoDB", error)
    }
}

module.exports = conn;