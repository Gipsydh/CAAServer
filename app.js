import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/connect.js'
import login from './routes/login.js'
import handleUsers from './routes/handleUsers.js'
import session from 'express-session'
import { Server } from 'socket.io'
import { createServer } from 'http'
import {
  onlineUsersInput,
  onlineUsersDelete,
  getCurrOnlineUser,
} from './onlineUsers.js'
import socketAuth from './middleware/socketAuth.js'
dotenv.config()

const port = 3001

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.LIVE_CLIENT,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
app.use(
  cors({
    origin: process.env.LIVE_CLIENT,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], //
    credentials: true,
  })
)
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
})
app.use(sessionMiddleware)

app.use(express.json())

app.use('/api/v1', login, handleUsers)
//socket io codes
io.engine.use(sessionMiddleware)
// io.use(socketAuth)
io.on('connection', (socket) => {
  const session = socket.request.session.email
  if (session) {
    onlineUsersInput(session)
    setTimeout(() => {
      io.emit('online-status', getCurrOnlineUser())
    }, 1000)
  }

  // console.log('getting session modified')
  // console.log(session)

  socket.on('enter', (m) => {
    // console.log(m)
    socket.join(m.res)
    const req = socket.request
    console.log("joining room")
    req.session.reload(() => {
      req.session.save()
    })

    socket.to(m.res).emit('check-status', m.username)
  })
  socket.on('message', (m) => {
    m.obj.status = 'receiver'
    console.log(m)
    socket.to(m.target).emit('receive-msg', m.obj)
  })
  socket.on('disconnect', (m) => {
    console.log(session + 'disconnected')
    onlineUsersDelete(session)
    io.emit('online-status', getCurrOnlineUser())

    io.emit('onDisconnect')
  })
})

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    server.listen(port, () => {
      console.log(`server is listening port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()
