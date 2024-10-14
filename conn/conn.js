const mongoose = require("mongoose")

const conn = async()=>{
    try {
        await mongoose.connect("mongodb+srv://aryan:aryan@cluster0.ewiwy.mongodb.net/")
    } catch (error) {
        console.log("Error in mongoDB", error)
    }
}

module.exports = conn;