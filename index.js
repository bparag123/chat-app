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

app.use(express.static(path.join(__dirname, "./static")))
app.use(express.json())

app.use("", roomController)
app.use("/user", userRoutes)

const server = http.createServer(app)

const io = new Server(server)

io.on("connection", socket => {
    console.log(socket.id);
    

    socket.on("send message", async (data, cb) => {
        const [room, user] = await Promise.all([
            Room.findOne({ name: data.room }),
            User.findOne({ username: data.user })])
        const msgToSave = {
            context: data.msg,
            from: user._id,
            time: new Date(data.time)
        }
        const dateForDatabase = new Date(data.time)
        console.log(dateForDatabase);
        console.log(dateForDatabase.getTimezoneOffset());
        if (room.messages.length > 0) {
            room.messages.push(msgToSave)
        } else {
            room.messages = [msgToSave]
        }
        await room.save()
        socket.broadcast.to(data.room).emit('incoming message', data)
        cb()
    })

    socket.on("join", async ({ user, room }, cb) => {
        socket.emit("welcome", `Welcome ${user}`)
        socket.join(room)
        socket.broadcast.to(room).emit('infoMsg', `${user} is online`)
        const myuser = await User.findOne({ username: user })
        myuser.socketId = socket.id
        myuser.currentRoom = room
        await myuser.save()
        cb()
    })

    socket.on("disconnect", async () => {
        console.log("disconnecting");
        const user = await User.findOne({ socketId: socket.id })

        socket.broadcast.to(user.currentRoom).emit('infoMsg', `${user.username} is offline`)
        user.socketId = undefined
        user.currentRoom = undefined
        await user.save()
        console.log("disconnected");


    })

})

server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
})