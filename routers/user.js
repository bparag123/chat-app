import {Router} from "express";
import User from "../models/user.js";

const router = Router()

router.get("/signup", async (req, res, next)=>{
    
    res.render("signup")
})

router.post("/signup", async (req, res, next)=>{
    const user = new User(req.body)
    await user.save()
    res.redirect("../join-room")
})

export default router