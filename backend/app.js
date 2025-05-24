require('dotenv').config().parsed
require('./config/db')
const express = require('express')
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/userRoute')
const cors = require('cors')
const postRouter = require('./routers/postRoute')
const notificationRouter = require('./routers/notificationRoute')
const http = require('http')
const { socketInit } = require('./socket/socketInit')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true
}))

const server = http.createServer(app)
socketInit(server)

app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/notification', notificationRouter)

const port = process.env.Port || 8002



server.listen(port, () => {
    console.log(`server is running on Port ${port}`)
})

