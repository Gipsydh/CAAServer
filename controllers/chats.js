import chats from '../models/chats.js'
import users from '../models/users.js'
import friends from '../models/friends.js'
import friendReqs from '../models/friendReqs.js'
const chat = async (req, res) => {
  console.log(req.body)
  // console.log(req.session.email)
  const currentDate = new Date()

  // Get the current date in the format "YYYY-MM-DD"
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const currentDateFormatted = `${year}-${month}-${day}`

  // Get the current time in the format "HH:mm:ss"
  const hour = String(currentDate.getHours()).padStart(2, '0')
  const minute = String(currentDate.getMinutes()).padStart(2, '0')
  const second = String(currentDate.getSeconds()).padStart(2, '0')
  const currentTimeFormatted = `${hour}:${minute}:${second}`

  // Combine date and time
  const dateTimeFormatted = `${currentDateFormatted},${currentTimeFormatted}`

  // Display the current date and time in "date,time" format
  const obj = {
    text: req.body.msg,
    sender: req.session.email,
    receiver: req.body.username,
    time: dateTimeFormatted,
    status: 'S',
    chatRoomID: req.body.chatRoomID,
  }

  console.log(obj)
  await chats
    .insertMany({
      text: req.body.msg,
      sender: req.session.email,
      receiver: req.body.username,
      time: dateTimeFormatted,
      status: 'S',
      chatRoomID: req.body.chatRoomID,
      chatHolders: [req.session.email, req.body.username],
    })
    .then((resp) => {
      res.status(200).json({ msg: 'message received' })
    })
}
const userName = (req, res) => {
  return res.status(200).json({ username: req.session.email })
}

const findUsers = async (req, res) => {
  await friends.find({ for: req.session.email }).then((resp) => {
    res.status(200).json(resp[0])
  })
  // friends.insertMany({
  //   for:"subhnaskar11@gmail.com",
  //   haveFrnds:["onibabahaha123456@gmail.com"]
  // })
  //  friends.insertMany({
  //    for: 'onibabahaha123456@gmail.com',
  //    haveFrnds: ['subhnaskar11@gmail.com'],
  //  })
  //  console.log("done")
  // try {
  //   console.log(req.body)
  //   let response=[]
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //   if (emailPattern.test(req.body.userName)) {
  //     await users
  //       .find({
  //         email: { $regex: req.body.userName, $options: 'i' },
  //       })
  //       .then((resp) => {
  //         console.log(resp)
  //       })
  //   } else {
  //     await users
  //       .find({
  //         fullName: { $regex: req.body.userName, $options: 'i' },
  //       })
  //       .then((resp) => {

  //         // let nonFriends=resp.filter(item=>  !friends.include())
  //         // console.log(friends,nonFriends)
  //       })
  //   }

  //   res.status(200).json({ msg: 'fine' })
  // } catch (error) {
  //   console.log(error)
  // }
}
const getParticularUser = async (req, res) => {
  await users
    .find({
      email: req.body.username,
    })
    .then((resp) => {
      res.status(200).json(resp)
    })
}
const getSimilarUser = async (req, res) => {
  try {
    let response = []
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailPattern.test(req.body.userName)) {
      await users
        .find({
          email: { $regex: req.body.userName, $options: 'i' },
        })
        .then((resp) => {
          const newResp = resp.filter(
            (item) => item.email !== req.session.email
          )
          res.status(200).json(newResp)
        })
    } else {
      await users
        .find({
          fullName: { $regex: req.body.userName, $options: 'i' },
        })
        .then((resp) => {
          const newResp = resp.filter(
            (item) => item.email !== req.session.email
          )
          res.status(200).json(newResp)
        })
    }
  } catch (e) {}
}
const isFriend = async (req, res) => {
  try {
    await friends.find({ for: req.session.email }).then((resp) => {
      if (resp[0] !== null && resp[0].haveFrnds.includes(req.body.username)) {
        res.status(200).json({ friend: true })
      } else {
        res.status(200).json({ friend: false })
      }
    })
  } catch (e) {
    console.log(e)
  }
}
const sendFrndReq = async (req, res) => {
  const currentDate = new Date()

  // Get the current date in the format "YYYY-MM-DD"
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const currentDateFormatted = `${year}-${month}-${day}`

  // Get the current time in the format "HH:mm:ss"
  const hour = String(currentDate.getHours()).padStart(2, '0')
  const minute = String(currentDate.getMinutes()).padStart(2, '0')
  const second = String(currentDate.getSeconds()).padStart(2, '0')
  const currentTimeFormatted = `${hour}:${minute}:${second}`

  // Combine date and time
  const dateTimeFormatted = `${currentDateFormatted},${currentTimeFormatted}`
  try {
    let key = ''
    if (req.session.email > req.body.username) {
      key = req.body.username + req.session.email
    } else {
      key = req.session.email + req.body.username
    }
    await friendReqs
      .insertMany({
        from: req.session.email,
        to: req.body.username,
        date: dateTimeFormatted,
        key: key,
      })
      .then((resp) => {
        res.status(200).json({ msg: 'req sent' })
      })
  } catch (error) {}
}
const getNotification = async (req, res) => {
  await friendReqs
    .find({
      to: req.session.email,
    })
    .then((resp) => {
      res.status(200).json(resp)
    })
}
const acceptFrndReq = async (req, res) => {
  await friends
    .updateOne(
      {
        for: req.session.email,
      },
      {
        for: req.session.email,
        $push: { haveFrnds: req.body.username },
      },
      {
        upsert: true,
      }
    )
    .then(async (resp) => {
      let key = ''
      if (req.session.email > req.body.username) {
        key = req.body.username + req.session.email
      } else {
        key = req.session.email + req.body.username
      }
      await friendReqs
        .deleteMany({
          key: key,
        })
        .then(async (resp) => {
          await friends
            .updateOne(
              {
                for: req.body.username,
              },
              {
                for: req.body.username,
                $push: { haveFrnds: req.session.email },
              },
              {
                upsert: true,
              }
            )
            .then((resp) => {
              res.status(200).json({ msg: 'both way insertion done' })
            })
        })
    })
    .catch((e) => {
      res.status(200).json({ error: "something's wrong" })
    })
}
const rejectFrndReq = async (req, res) => {
  let key = ''
  if (req.session.email > req.body.username) {
    key = req.body.username + req.session.email
  } else {
    key = req.session.email + req.body.username
  }
  await friendReqs
    .deleteMany({
      key: key,
    })
    .then((resp) => {
      return res.status(200).json({ msg: 'rejected successfully' })
    })
}
const getChats = async (req, res) => {
  console.log('user token' + req.body.currRoomID)
  await chats
    .find({
      chatRoomID: req.body.currRoomID,
      chatHolders: { $in: [req.session.email] },
    })
    .then((resp) => {
      return res.status(200).json(resp)
    })
}
const getLastChat = async (req, res) => {
  let roomID = req.session.email
  let tempRoomID = [roomID]
  tempRoomID.push(req.body.username)
  let resn = tempRoomID.sort().join('|')
  console.log('getting name room id')
  console.log(resn)
  await chats
    .find({ chatRoomID: resn, chatHolders: { $in: [req.session.email] } })
    .then((resp) => {
      console.log(resp[resp.length - 1])
      return res.status(200).json(resp[resp.length - 1])
    })
}
const getLoginUser = async (req, res) => {
  await users
    .find({
      email: req.session.email,
    })
    .then((resp) => {
      return res.status(200).json(resp)
    })
}
const deleteChatFromUser = async (req, res) => {
  console.log('chats being deleted')

  await chats
    .updateMany(
      {
        chatRoomID: req.body.chatRoomID,
      },
      {
        $pull: { chatHolders: req.session.email },
      }
    )
    .then((resp) => {
      console.log(resp)
      return res.status(200).json({ msg: 'deleted' })
    })
    .then((err) => {
      console.log(err)
    })
}
export {
  chat,
  userName,
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
  getLastChat,
}
