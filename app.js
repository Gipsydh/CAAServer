import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/connect.js'
import login from './routes/login.js'
import handleUsers from './routes/handleUsers.js'
import session from 'express-session'
import { Server } from 'socket.io'
import { createServer } from 'http'
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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(express.json())

app.use('/api/v1', login, handleUsers)

//socket io codes
io.on('connection', (socket) => {
  socket.on('enter', (m) => {
    console.log('entering room')
    console.log(m)
    socket.join(m.res)
    console.log('user joined' + m.res)
    socket.to(m.res).emit('check-status', m.username)
    console.log('--------')
  })
  socket.on('message', (m) => {
    m.obj.status = 'receiver'
    console.log(m)
    socket.to(m.target).emit('receive-msg', m.obj)
  })
  socket.on('disconnect', (m) => {
    console.log('disconnected')
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
