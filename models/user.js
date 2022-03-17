import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type: String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    socketId:{
        type:String
    },
    currentRoom:{
        type:String
    }
})


export default mongoose.model("User", userSchema)