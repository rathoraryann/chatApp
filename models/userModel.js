const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    pic: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
    }
},
{
    timestamps: true
}
)

userSchema.methods.matchPassword = async function(pass){
    return pass == this.password;
}

const User = mongoose.model("User", userSchema)

module.exports = User;