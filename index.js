import express from "express";
import { Server } from "socket.io";
import http from "http"
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import userRoutes from './routers/user.js'
import "./db.js"
import roomController from "./controllers/room.js";
import Room from "./models/room.js";
import User from "./models/user.js";
import Handlebars from "handlebars"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import helpers from "./helper.js"

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
dotenv.config()

const PORT = process.env.PORT
const app = express()

//Setting Up Handlebars
app.engine("hbs", exphbs.engine({
    layoutsDir: path.join(__dirname, "./templates/layouts"),
    extname: ".hbs",
    partialsDir: path.join(__dirname, "./templates/partials"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: helpers
}))

app.set("view engine", "hbs");
app.set("views", "templates");
app.use(bodyParser.urlencoded({ extended: true }))

//Setting us static files
app.use(express.static(path.join(__dirname, "./static")))
app.use(express.json())

app.use("", roomController)
app.use("/user", userRoutes)

//Http Server for Socket
const server = http.createServer(app)

//Socket Server
const io = new Server(server)

io.on("connection", socket => {

    //Listeing send message event.
    socket.on("send message", async (data, cb) => {
        //Finding Room and User
        const [room, user] = await Promise.all([
            Room.findOne({ name: data.room }),
            User.findOne({ username: data.user })])
        //Creating the Message format to save
        const msgToSave = {
            context: data.msg,
            from: user._id,
            time: new Date(data.time)
        }
        
        if (room.messages.length > 0) {
            room.messages.push(msgToSave)
        } else {
            room.messages = [msgToSave]
        }
        await room.save()
        //Send Broadast message to all other members and firing incoming message event
        socket.broadcast.to(data.room).emit('incoming message', data)
        cb()
    })

    //Listening to the Join Event
    socket.on("join", async ({ user, room }, cb) => {
        //When User Joins Fire Welcome Event
        socket.emit("welcome", `Welcome ${user}`)
        //Joining the socket to specific room
        socket.join(room)

        socket.broadcast.to(room).emit('infoMsg', `${user} is online`)

        const myuser = await User.findOne({ username: user })
        myuser.socketId = socket.id
        myuser.currentRoom = room
        await myuser.save()
        cb()
    })

    socket.on("disconnect", async () => {

        const user = await User.findOne({ socketId: socket.id })
        //Sending message to all the user of currentRoom 
        socket.broadcast.to(user.currentRoom).emit('infoMsg', `${user.username} is offline`)
        user.socketId = undefined
        user.currentRoom = undefined
        await user.save()


    })

})

server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
})