import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name :{
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    verificationToken:{
        type: String,
    },
    verificationTokenxpiry:{
        type: Date
    },



}, 
{
    timestamps: true,
})

const User = mongoose.model("User", userSchema)

export default User;