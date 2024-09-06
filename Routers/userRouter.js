import express from "express";
import { userSignup,userLogin,allusers,updateuserImage,updateuserName} from "../Controllers/userController.js";
import { protect } from "../MiddleWare/authorization.js";

const UserRouter = express.Router();
UserRouter.route('/signup').post(userSignup)
UserRouter.route('/login').post(userLogin)
UserRouter.route('/').get(protect,allusers)
UserRouter.route('/updatename/:id').post(protect,updateuserName)
UserRouter.route('/updateuserImage').post(protect,updateuserImage)

export default UserRouter