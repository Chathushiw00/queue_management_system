import http from 'http'
import express  from "express"
import Cors from 'cors'
import dotenv from 'dotenv'
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Nuser } from "./models/Nuser"
import { Cuser } from "./models/Cuser"
import { Notification } from "./models/Notification" 
import { Issue } from "./models/Issue"
import { Counter } from "./models/Counter"
import loginRouter from "./routes/loginRoute"
import CuserRouter from "./routes/CuserRoutes"
import NuserRouter from "./routes/NuserRoutes"
import { ValidateToken } from "./libs/verifyToken"
import { Server } from 'socket.io'
import {getcurrentnext1,getcurrentnext2,getcurrentnext3} from './controllers/cusercontroller'
const cookieParser = require('cookie-parser')


dotenv.config();


const app = express()

const server = http.createServer(app)

//db config typeorm
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "queuesystem",
    entities: [Counter,Cuser,Issue,Notification,Nuser], //see the correct entities names
    synchronize: true,
    logging: false,
})

 //middleware
 app.use(express.json())
 app.use(Cors())
 app.use(express.urlencoded({extended: true}))
 app.use(cookieParser())
 

 //routes

//login router
app.use('/', loginRouter)

//loginRouter my
//counterUserRouter routes
app.use('/cuser',ValidateToken,CuserRouter)

//normalUserRouter routes
app.use('/nuser',ValidateToken,NuserRouter) 


 
//initialize
AppDataSource.initialize()
    .then(() => {
      console.log('db connected')
      
    })
    .catch((error) => console.log(error))


//socket.io
export const io = new Server(server,{cors: {origin: "http://localhost:3000"}})

let onlineUsers: any = []

const addNewUser = (username:any, socketId:any) => {
  !onlineUsers.some((user:any) => user.username === username) && onlineUsers.push({ username, socketId })
}


//remove user
const removeUser = (socketId:any) => {
  onlineUsers = onlineUsers.filter((user:any) => user.socketId !== socketId)
}


const getUser = (username:any) => {
  return onlineUsers.find((user:any) => user.username === username)
}

  io.on("connection",(socket) => {


      //add new user
      socket.on("newUser", (username) => {
        addNewUser(username, socket.id)
      })
      
      console.log('online users',onlineUsers)


      //send notifications
      socket.on("sendNotification", ({ receiverName, type, id }) => {
        const receiver = getUser(receiverName)
        console.log(getUser(receiverName))

        io.to(receiver.socketId).emit("getNotification", {
            id,
            type
        })
      })

      
      //setInterval
   /*    setInterval(function(){
      
            getcurrentnext1().then((Counter) => {
                io.emit('getqueuenum1', Counter)            
            })
  
            getcurrentnext2().then((Counter) => {
                io.emit('getqueuenum2', Counter)            
            })
  
            getcurrentnext3().then((Counter) => {
                io.emit('getqueuenum3', Counter)           
            })
            
        }, 1000) */
        
        socket.on('disconnect',()=>{
            removeUser(socket.id);
        })  
  })


    //server running
    server.listen(8000, ()=>{
      
      console.log('app running on server 8000')
     })