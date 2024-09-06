import express from "express";
import { accessChat , fetchChats , createGroupChat , renameGroup , addToGroup , removeFromGroup} from "../Controllers/chatController.js";
import { protect } from "../MiddleWare/authorization.js";

const chatRouter = express.Router()
chatRouter.route('/accessChat').post(protect,accessChat)
chatRouter.route('/getAllChats').get(protect,fetchChats)
chatRouter.route('/createGroup').post(protect,createGroupChat)
chatRouter.route('/renameGroup').patch(protect,renameGroup)
chatRouter.route('/addToGroup').patch(protect,addToGroup)
chatRouter.route('/removeFromGroup').patch(protect,removeFromGroup)

export default chatRouter;