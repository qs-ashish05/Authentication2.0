import mongoose from 'mongoose'
import dotenv from "dotenv"

dotenv.config("./env")

const connect_db = () => {
    const url =  process.env.MONGODB_URL   
    
    mongoose.connect(url)
    .then(()=>{
        console.log("database connected succesful");
        
    })
    .catch((err) => {
        console.log(`Error accured in connecting DB - ${err}`)
    })

}

export default connect_db;