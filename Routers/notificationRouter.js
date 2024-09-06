import express from "express";
import { protect } from "../MiddleWare/authorization.js";
import { sendNotification,fetchNotification,deleteNotification } from "../Controllers/notificationController.js";
//import notificationModel from "../Models/NotificationModel.js";

// const deleteData = async(req,res)=>{
//     await notificationModel.deleteMany()
//     res.send("deleted")
//    }

let notiRouter = express.Router();
notiRouter.route('/sendNotification').post(protect,sendNotification);
notiRouter.route('/fetchNotification').get(protect,fetchNotification);
notiRouter.route('/deleteNotification').post(protect,deleteNotification);
//notiRouter.route('/deleteNotification').delete(deleteData)

export default notiRouter 

