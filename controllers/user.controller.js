import User from "../model/user.model.js"
import crypto from "crypto"
import sendVerificationMail from "../utils/sendMail.user.js";

const register = async (req, res) => {
    // res.send("Hello registre")

    const {name, email, password } = req.body;

    if (!name || !email || !password){
        return res.status(400).json({
            message: "all fields are required",
            success: false            
        })
    }

    if (password.length < 8){
        return res.status(400).json({
            message: "Password must be of minimum length 8",
            success: false            
        })
    }

    try {
        const existingUser = await User.findOne({
            email: email
        })

        if(existingUser){
            return res.status(400).json({
                message: "User email Already exist",
                success: false            
            })  
        }

        // generate temporary token
        const token = crypto.randomBytes(32).toString("hex")
        const tokenExpiry = new Date.now() + 10*60*60*1000;

        // create new user 
        const user = User.create({
            name, 
            email,
            password,
            verificationToken: token,
            verificationTokenxpiry: tokenExpiry
        })

        // check if user is created or not
        if(!user){
            return res.status(200).json({
                message: "User Not Created",
                success: false            
            }) 
        }

        // send mail to send token
        await sendVerificationMail(email, token);

        return res.status(400).json({
            message: `user with email (${email}) created succesfully please verify account using link shared on email`,
            success: true            
        })

    }catch(err){
        console.log(`error is ${err}`);
        return res.status(500).json({
            message: "Internal server accured",
            success: true            
        })
        
    }

 } 


const verify = async( req, res) => {
    try {
        const token = req.params.token;
    
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenxpiry: {$gt: Date.now()}
        });
    
        if(!user){
            res.status(400).json({
                message: "Invalid token",
                success: false
            })
        }
    
        user.isVerified = true;
        user.verificationToken = undefined
        user.verificationTokenxpiry = undefined
    
        await user.save()
    
        return res.send(200).json({
            message: "User account is verified",
            success: true
        })
    } catch (error) {
        return res.send(500).json({
            message: "Internal server error in user verification",
            success: true
        })
    }
}


const login = async(req, body) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).json({
            message: "Please give credentials",
            success: false
        })
    }

    try{
        const user = await User.findOne({
            email:email,
        })

        if(!user || !user.isVerified){
            res.status(400).json({
                message: "Invalid credenials no user found",
                success: false
            })
        }

        


    } catch{

    }
}


export {register, verify}