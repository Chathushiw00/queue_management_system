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
import {getcurr_next1,getcurr_next2,getcurr_next3} from './controllers/cusercontroller'
import loginRouter from "./routes/loginRoute"
import CuserRouter from "./routes/CuserRoutes"
import NuserRouter from "./routes/NuserRoutes"
import { ValidateToken } from "./libs/verifyToken"
import { Server } from 'socket.io'


const cookieParser = require('cookie-parser')


dotenv.config();


const app = express()

const server = http.createServer(app)

// typeorm db configuration
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


 
//initialization
AppDataSource.initialize()
    .then(() => {
      console.log('db connected')
      
    })
    .catch((error) => console.log(error))


//socket.io
export const io = new Server(server,{cors: {origin: "http://localhost:3000"}})

let onlineUsers: any = []

const addNewUser = (receiverId:any, socketId:any) => {
  !onlineUsers.some((user:any) => user.receiverId === receiverId) && 
  onlineUsers.push({ receiverId, socketId })
  console.log('online users', onlineUsers)
}


//remove user
const removeUser = (socketId:any) => {
  onlineUsers = onlineUsers.filter((user:any) => user.socketId !== socketId)
}


const getUser = (receiverId:any) => {
  return onlineUsers.find((user:any) => user.receiverId === receiverId)
}

  io.on("connection",(socket) => {


      //add new user
      socket.on("newUser", (receiverId) => {
        addNewUser(receiverId, socket.id)
      })
      


      //send notifications
      socket.on("sendNotification", ({ receiverId, type, id }) => {
        const receiver = getUser(receiverId)
        console.log('Id of the receiver', receiverId)
        console.log(getUser(receiverId))

        if(receiver){

          io.to(receiver.socketId).emit("getNotification", {
              id,
              type
          })
      }
      })

      
      //setInterval
       setInterval(function(){
      
        getcurr_next1().then((Counter) => {
                io.emit('getqueuenum1', Counter)            
            })
  
            getcurr_next2().then((Counter) => {
                io.emit('getqueuenum2', Counter)            
            })
  
            getcurr_next3().then((Counter) => {
                io.emit('getqueuenum3', Counter)           
            })
            
        }, 1000) 
        
        socket.on('disconnect',()=>{
            removeUser(socket.id);
        })  
  })


    //server running
    server.listen(8000, ()=>{
      
      console.log('system running on server 8000')
     })