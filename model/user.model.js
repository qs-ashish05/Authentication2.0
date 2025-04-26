import mongoose from "mongoose"
import bcrypt from "bcryptjs"


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
        minlength: 6
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

// password hashing usinh mongoose hooks
// pre means change this before
//this can be considered as middleware 
userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
    // either we can use the bcrypt.genSalt() method that we can use to gnerate salt value and pass that value into the below, 
    this.password = await bcrypt.hash(this.password, 10); // here 10 is salting value
    };
    next();
})



// thsi User is indicates the schema name
const User = mongoose.model("User", userSchema)

export default User;