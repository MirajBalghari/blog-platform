const socket = require('socket.io')

let io
const registedUser = new Map()
const socketInit = (server) => {

  io = socket(server, {
    cors: {
      origin: process.env.FRONT_URL,
      credentials: true
    }
  })
  io.on('connection', (socket) => {
    socket.on('register', (userId) => {
      registedUser.set(userId, socket.id)
    })

    socket.on('disconnect', () => {
      // console.log('disconnet', socket.id)
    })
  })

  return io;
}

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { socketInit, getIo, registedUser }