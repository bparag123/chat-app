import {Router} from "express"
import User from "../models/user.js";
import Room from "../models/room.js"

const router = Router()

router.get("/room", (req, res, next) =>{
    res.render("room")
})

router.get("/join-room", async (req, res, next)=>{
    const rooms = await Room.find().lean()
    res.render("join-room", {rooms})
})

router.post("/join-room", async (req, res, next)=>{
    //Checking for valid user, room and password
    const {username, password, roomName} = req.body
    const user = await User.findOne({username})
    if(!user){
        return res.json("User Not Found")
    }
    if(user.password !== password){
        return res.json("Invalid Password")
    }
    const room = await Room.findOne({name:roomName})
    .populate("users messages.from")
    
    if(!room){  
        return res.json("Room not Found")
    }
    if(room.users.length === 0){
        room.users = [user._id]
    }
    else{
        //Checking for Member of Room
        const alreadyMember = room.users.findIndex((ele)=>{
            return ele._id.toString() === user._id.toString()
        })
        if(alreadyMember<0){
            room.users.push(user._id)
        }
    }
    await room.save()
    
    const users = [] 
    room.users.forEach((ele)=>{
        if(ele._id.toString() !== user._id.toString()){
            users.push({
                username:ele.username,
                _id:ele._id
            })
        }
    })
    
    const data = {
        users : users,
        room:room.name,
        currentUser : user.username,
        messages:room.messages
    }
    
    res.render("chat", {data})
})

router.post("/room",async (req, res, next) =>{
    const {room} = req.body
    const r = new Room({name:room})
    await r.save()
    res.redirect("/join-room")
})

export default router