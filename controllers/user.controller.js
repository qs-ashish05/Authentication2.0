import User from "../model/user.model.js"
import crypto from "crypto"
import sendVerificationMail from "../utils/sendMail.user.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { log } from "console";
import bcrypt from "bcryptjs";


// this function is async becuse uder this function we have used await keyword because database calls are required
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
        console.log("i worked")
        // generate temporary token
        const token = crypto.randomBytes(32).toString("hex")
        const tokenExpiry = Date.now() + 10*60*1000; // token to be exipire in next 10 mins
        console.log(tokenExpiry);
        


        // create new user 
        const user = await User.create({
            name, 
            email,
            password,
            verificationToken: token,
            verificationTokenxpiry: tokenExpiry
        })

        // check if user is created or not
        if(!user){
            return res.status(200).json({
                message: "Something went wrong, User Not Created",
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
            message: "Internal server error accured",
            success: true            
        })
        
    }

 } 


const verify = async( req, res) => {
    console.log("in verification");
    
    try {
        // extract the data passed in the param via routing
        const token = req.params.token;  // router.get("/verify/:token", verify);
        // name of the param given in route url should be same.
        // console.log(token)
        //find user by token
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenxpiry: {$gt: Date.now()}  // verification date should be greater than  current date.
        });
    
        if(!user){
            res.status(400).json({
                message: "Invalid token",
                success: false
            })
        }
    
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenxpiry = undefined;
    
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


const login = async(req, res) => {
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

        console.log(user);
        console.log(user.isVerified);
        
        if(!user || !user.isVerified){
            res.status(400).json({
                message: "Invalid credenials no user found",
                success: false
            })
        }

        // check password
        console.log("checking password ");
        
        const isPasswordMatched = bcrypt.compare(password, user.password);
        console.log(isPasswordMatched)
        if(!isPasswordMatched){
            // wrong password
            return res.status(200).json({
                message: "Invalid credenials no user found wrong password",
                success: false 
            });
        }
        
        console.log("generetaing jwt token");
        
        //jwt token 
        // shhh is iniial tokn key should be kept in .nv file
        const jwt_toekn = jwt.sign({id: user._id}, "shhh",
            {expiresIn: '24h'}
        );

        // store the jwt into cookies
        const cookie_options = {
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60*1000
        };
        res.cookie("test", jwt_toekn, cookie_options);

        res.status(200).json({
            message: "Login succesful !",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            },
            jwt_toekn
        })
    } catch(err){
        console.log("error in log in", err);
        
        return res.status(200).json({
            message: "Error accured in log in",
            success: false 
        });
    }
}


const getProfile = async (req, res) => {
    try{
        const user_data = req.user;
        console.log("data is", user_data)

        // User.findById(req.user.id);  //id key is set by user // this will get all data 
        const user = User.findById(req.user.id).select("-password") // give me all data of the user but don't give me his password
        console.log("get profile controller");

        if(!user) {
            return res.status(201).json({
                message: "No user found",
                success: false
            });
        }
        res.status(200).json({
            success: true,
            user_data
        });
    }
    catch(err){
        console.log("Erro is", err);
        
        res.status(500).json({
            message: "Error in getting user profile",
            success: false
        })
    }
}


const logOutUser = async (req, res) => {
    try{
        // clear the cookies
        res.cookie('test', '');
        res.status(200).json({
            message: "user logged out",
            success: true
        })
    }
    catch(err){
        console.log("Error in log out: ", err);
        res.status(201).json({
            message: "Log out failed error accured",
            success: false
        })
    }
}

const forgootPassword = async (req, res) => {
    try{

        const email = req.body.email;

        const user = User.findOne({
            email: email
        })

        if(!user){
            console.log("No user found for given email");
        }

        // send otp / verification link to the user 

        // after verification send likn to set new password 

        // take new password 

        // store that into User id

        res.status(200).json({
            message: "Forget password - password set",
            success: true
        })
        
    }
    catch(err){
        console.log("Error is - ", error)
        res.status(200).json({
            message: "Forget password - pSomething wrong error",
            success: true
        })   
    }
}

const setPassword = async (req, res) => {
    try{
        res.status(200).json({
            message: "Password set from user profile",
            success: true
        })
    }
    catch(err){
        res.status(400).json({
            message: " error in Password set from user profile",
            success: false
        })
    }
}



export {register, verify, login, getProfile, logOutUser, forgootPassword, setPassword}