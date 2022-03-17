import mongoose from "mongoose";

const msgSchema = mongoose.Schema({
    text:{
        type: String,
        required:true,
    },
    user
})


export default mongoose.model("Room", roomSchema)