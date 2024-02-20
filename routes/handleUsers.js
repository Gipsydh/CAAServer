import express from 'express'
import userLoginVerify from '../middleware/userLogin.js'
import {
  findUsers,
  getParticularUser,
  getSimilarUser,
  isFriend,
  sendFrndReq,
  getNotification,
  acceptFrndReq,
  rejectFrndReq,
  getChats
} from '../controllers/chats.js'
const router = express.Router()

router.route("/chats/getUsers").get(findUsers)
router.route("/chats/getOneUser").post(getParticularUser)
router.route('/chats/getSimilarUser').post(getSimilarUser)
router.route('/chats/isFriend').post(isFriend)
router.route("/chats/sendReq").post(sendFrndReq)
router.route("/chats/getNotification").get(getNotification)
router.route("/chats/acceptFrndReq").post(acceptFrndReq)
router.route('/chats/rejectFrndReq').post(rejectFrndReq)
router.route('/chats/getChats').post(getChats)



export default router
