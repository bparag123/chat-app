import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const url = process.env.MONGODB_URL || "mongodb://localhost:27017/chatApp"
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

mongoose.connection.on("open", ()=>{
    console.log("Db Connected");
})

export default mongoose
