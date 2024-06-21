import express from "express"
import {login,home} from "../controllers/login.js"
import {chat,userName} from "../controllers/chats.js"
import userLoginVerify from "../middleware/userLogin.js"
import upload from "../middleware/imageData.js"
const router=express.Router()
router.route("/home").get(userLoginVerify,home)
router.route("/login").post(login)
router.route("/chats").post(userLoginVerify,upload.single('content'),chat)
router.route('/chats').get(userLoginVerify, userName)

export default router