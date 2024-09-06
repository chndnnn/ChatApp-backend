import mongoose from "mongoose";

let NotificationSchema = new mongoose.Schema({
    Users : String,
    selectedChatID : {type:String,required:true}
})

const notificationModel = mongoose.model('notifications',NotificationSchema)
export default notificationModel