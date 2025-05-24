import { io } from 'socket.io-client'

const socket = io('http://localhost:8000',{
    withCredentails: true,
    transports: ['websocket','polling']
})

export default socket