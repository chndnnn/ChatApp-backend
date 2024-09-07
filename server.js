import dotenv from 'dotenv'
dotenv.config({path:'./config.env'})
import app from "./app.js"
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import {updateUserStatus} from './Controllers/userController.js'

mongoose.connect(process.env.CON_STRING).then(()=>{
    console.log('DB connection successfull')
}).catch((err)=>{
    console.log(err)
})

const port = process.env.PORT

let applicationServer = app.listen(port,()=>{
    console.log('server started successfully')
})

const io = new Server(applicationServer,{
    pingTimeout:60000,
   cors: {
    origin: 'https://roaring-banoffee-4a4a09.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  }
});

io.on("connection",(socket)=>{

    socket.on("setup",(userData)=>{
        socket.broadcast.emit("userOnline",userData )
        socket.join(userData._id)
        socket.emit("connected")
        updateUserStatus(userData._id,true)

    })

    socket.on("join chat",(room)=>{
        socket.join(room);
    })

    socket.on('typing',(room)=> socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=> socket.in(room).emit('stop typing'))

    socket.on("message received",(newMessageReceived)=>{
        var chat = newMessageReceived.chat
        if(!chat.users) return console.log("chat.user is not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return ;

            socket.in(user._id).emit("message received",newMessageReceived)
        });

    })
    
    socket.on("disconnect",()=>{
        if(socket.handshake.auth.token){
            socket.broadcast.emit('userOffile',socket.handshake.auth.token)
        updateUserStatus(socket.handshake.auth.token._id,false)
        }
    })
})
