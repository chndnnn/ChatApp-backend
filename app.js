import express from "express"
import UserRouter from "./Routers/userRouter.js"
import chatRouter from "./Routers/chatRouter.js"
import messageRouter from "./Routers/messageRoute.js"
import notiRouter from "./Routers/notificationRouter.js"
import cors from "cors"

const app = express()
app.use(cors({
  origin: 'https://roaring-banoffee-4a4a09.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}))
app.use(express.json())
app.use('/chat/v1',UserRouter,chatRouter,messageRouter,notiRouter)

export default app
