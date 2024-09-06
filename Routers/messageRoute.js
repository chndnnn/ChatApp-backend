import express from "express";
import { protect } from "../MiddleWare/authorization.js";
import { fetchMessage, sendMessage,fetchMessagepagination } from "../Controllers/messageController.js";

let messageRouter = express.Router();
messageRouter.route('/sendMessage').post(protect,sendMessage)
messageRouter.route('/fetchMessage/:id').get(protect,fetchMessage)
messageRouter.route('/fetchMessagepagination/:id').get(protect,fetchMessagepagination)


export default messageRouter;


