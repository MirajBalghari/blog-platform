require('dotenv').config().parsed
require('./config/db')
const express = require('express')
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/userRoute')
const cors =require('cors')
const path = require('path')
const postRouter = require('./routers/postRoute')


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use('/uploads', express.static(path.join(__dirname,'uploads')))
app.use('/user',userRouter)
app.use('/post',postRouter)

const port = process.env.Port || 8002



app.listen(port,()=>{
    console.log(`server is running on Port ${port}`)
})

