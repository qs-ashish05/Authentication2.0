import jwt from "jsonwebtoken";

export const isLogedIn = async (req, res, next) => {
    try {
        // get token 
        console.log("cookies data is ",req.cookies);
        let token = req.cookies.test || "";   // test is our key for token

        // check token
        if (token == "") {
            console.log("Token not found");
            return res.status(401).json({
                message: "Authentication failed please log in",
                success: false
            })
        }
        console.log("Token found");

        // extarct data from the token
        try {
            const decodedToken = jwt.verify(token, "shhh")  // best to load this shhh from .env file
            console.log("Decoded data is, ", decodedToken);

            req.user = decodedToken;  // here we are making bew key in the request         

            next();
        } catch (error) {
            console.log("Error in decoding the value of jwt token");
        }

    }
    catch (err) {
        console.log("Auth middleware failed");
        return res.status(400).json({
            message: "Internal server error",
            success: false
        })
    }

    next();
}