import mongoose from "mongoose";

const msgSchema = mongoose.Schema({
    context : {
        type:String,
        require:true
    },
    from : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time: Date
})

const roomSchema = mongoose.Schema({
    name:{
        type: String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true
    },
    users : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true
        }
    ],
    messages : [msgSchema]
})


export default mongoose.model("Room", roomSchema)