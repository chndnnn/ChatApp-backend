import {mongoose,Schema} from "mongoose"

const messageSchema = new mongoose.Schema({
   sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
   },
   content:{
    type : String,
    trim:true
   },
   chat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'chats'
   }
},{
    timestamps:true
})

const messageModel = mongoose.model('messages',messageSchema)

export default messageModel