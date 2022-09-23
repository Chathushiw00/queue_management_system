import { io } from 'socket.io-client'

const Socket=io("http://localhost:8000")

export default Socket;