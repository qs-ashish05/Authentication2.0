import express, { json, urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"
import connect_db from "./utils/databse.connect.js"
import router from "./routes/user.routes.js"
import cookieParser from "cookie-parser"


dotenv.config('./env')  // path of env file optional for root directory


const app = express()
const port = process.env.PORT || 3000
const origin = process.env.BASE_URL + ":" + port

app.use(express.json())  // app can control json fromat requests as well
app.use(urlencoded({extended:true})) // to enable url encoding
app.use(cookieParser())

app.use(cors({
    origin: origin,
    methods: ["POST", "GET", "UPDATE", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorisation"]
}))

// connecting to database
connect_db();

app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/api/v1/users", router)

app.listen(port, ()=>{
    console.log(`Server listing on port ${port}`);
    
})