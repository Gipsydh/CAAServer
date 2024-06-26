import express from 'express'
import path from 'path'
import { dirname } from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
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
const io = new Server(
  server,
  {
    cors: {
      origin: process.env.LIVE_CLIENT,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  },
  { maxHttpBufferSize: 1e8 }
)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use('/blobData', express.static(path.join(__dirname, 'blobData')))
app.use(
  cors({
    origin: process.env.LIVE_CLIENT,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], //
    credentials: true,
  })
)
app.set("trust proxy", 1);

const sessionMiddleware = session({
   secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    proxy:true,
  cookie: { secure: true, sameSite: "none" },

})
app.use(sessionMiddleware)

app.use(express.json())

app.use('/api/v1', login, handleUsers)


app.get('/proxy-img', async (req, res) => {
  const imageUrl = req.query.url // URL of the image to proxy
  console.log(imageUrl)
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch image')
    }
    console.log(response)
    const imageBuffer = await response.arrayBuffer() // Get image data as buffer
    res.set('Content-Type', response.headers.get('Content-Type'))
    console.log(imageBuffer)
    res.send(Buffer.from(imageBuffer))
  } catch (error) {
    console.error('Error fetching image:', error)
    res.status(500).send('Error fetching image')
  }
})






//socket io codes
io.engine.use(sessionMiddleware)
// io.use(socketAuth)
io.on('connection', (socket) => {
  const session = socket.request.session.email
  if (session) {
    onlineUsersInput(session)
    setTimeout(() => {
      let temp = getCurrOnlineUser()
      console.log(temp)
      io.emit('online-status', temp)
    }, 1000)
  }

  // console.log('getting session modified')
  // console.log(session)

  socket.on('enter', (m) => {
    // console.log(m)
    socket.join(m.res)
    const req = socket.request
    console.log('joining room')
    req.session.reload(() => {
      req.session.save()
    })

    socket.to(m.res).emit('check-status', m.username)
  })
  socket.on('message', (m) => {
    m.obj.status = 'receiver'
    // console.log(m)
    socket.to(m.target).emit('receive-msg', m.obj)
  })
  socket.on('disconnect', (m) => {
    console.log(session + 'disconnected')
    onlineUsersDelete(session)
    console.log('deleting user from the online users')
    console.log(getCurrOnlineUser())
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
