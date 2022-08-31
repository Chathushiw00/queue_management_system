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
import counterUserRouter from "./routes/counterUserRoutes"
import normalUserRouter from "./routes/normalUserRoutes"
import { ValidateToken } from "./libs/verifyToken"
import { Server } from 'socket.io'
import { appendFile } from "fs"
import { userInfo } from 'os'
import {getcurrentnext2,getcurrentnext3,getcurrentnext4} from './controllers/cusercontroller'


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
 

 //routes

//login router
app.use('/', loginRouter)

/* loginRouter my
//nuser routes
router.post('/nuser/login',loginNuser)

//cuser routes
router.post('/cuser/login',loginCuser) */


//counteruser routes
app.use('/cuser',ValidateToken,counterUserRouter)
//normaluser routes
app.use('/nuser',ValidateToken,normalUserRouter)


 
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

const getUser = (username:any) => {
  return onlineUsers.find((user:any) => user.username === username)
}

  io.on("connection",(socket) => {

      //add new user

      socket.on("newUser", (username) => {
        addNewUser(username, socket.id)
      })
      console.log('online users',onlineUsers)

      //remove user
      const removeUser = (socketId:any) => {
        onlineUsers = onlineUsers.filter((user:any) => user.socketId !== socketId)
      }

      //send notifications
      socket.on("sendNotification", ({ receiverName, type,id }) => {
        const receiver = getUser(receiverName)
        console.log(getUser(receiverName))

        io.to(receiver.socketId).emit("getNotification", {
            id,
            type
        })
      })

      //setInterval
      setInterval(function(){
      
            getcurrentnext2().then((Counter) => {
                io.emit('getqueuenum1', Counter)            
            })
  
            getcurrentnext3().then((Counter) => {
                io.emit('getqueuenum2', Counter)            
            })
  
            getcurrentnext4().then((Counter) => {
                io.emit('getqueuenum3', Counter)           
            })
            
        }, 1000)
        
        socket.on('disconnect',()=>{
            removeUser(socket.id);
        })  
  })


    //server running
    server.listen(8000, ()=>{
      
      console.log('app running on server 8000')
     })