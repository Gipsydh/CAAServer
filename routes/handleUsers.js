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
  getChats,
  getLoginUser,
  deleteChatFromUser,
  getLastChat

} from '../controllers/chats.js'
const router = express.Router()

router.route("/chats/getUsers").get(userLoginVerify,findUsers)
router.route("/chats/getLoginUser").get(userLoginVerify,getLoginUser)
router.route("/chats/getOneUser").post(userLoginVerify,getParticularUser)
router.route('/chats/getSimilarUser').post(userLoginVerify,getSimilarUser)
router.route('/chats/isFriend').post(userLoginVerify,isFriend)
router.route("/chats/sendReq").post(userLoginVerify,sendFrndReq)
router.route("/chats/getNotification").get(userLoginVerify,getNotification)
router.route("/chats/acceptFrndReq").post(userLoginVerify,acceptFrndReq)
router.route('/chats/rejectFrndReq').post(userLoginVerify,rejectFrndReq)
router.route('/chats/getChats').post(userLoginVerify,getChats)
router.route('/chats/userChatDelete').post(userLoginVerify,deleteChatFromUser)
router.route("/chats/getLastChat").post(userLoginVerify,getLastChat)


export default router
