import express from "express";
import { forgootPassword, getProfile, login, logOutUser, register,verify , setPassword} from "../controllers/user.controller.js";
import { isLogedIn } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register", register);
router.get("/verify", verify);
router.post("/login", login);
router.get("/getprofile", isLogedIn ,getProfile)
router.get("/logout", logOutUser);
router.post("/forgotpassword", forgootPassword);
router.post("/resetpassword", setPassword);


export default router;