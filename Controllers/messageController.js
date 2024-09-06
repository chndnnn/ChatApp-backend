import chatModel from "../Models/ChatModel.js"
import messageModel from "../Models/messageModel.js"
import userModel from "../Models/userModel.js"

export const sendMessage = async (req,res)=>{

    let {chatId,content} = req.body
    if(!chatId,!content){
        res.status(400).json({
            status:"fail",
            data:{
                messgae:'some issue occured cannot be created'
            }
        })
    }

    let newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId
    }
    
    try{
    let message = await messageModel.create(newMessage)

    message = await message.populate("sender","name image");
    message = await message.populate("chat");
    message = await userModel.populate(message,{
        path:'chat.users',
        select:"name image email"
    })

    await chatModel.findByIdAndUpdate(chatId,{
        latestMessage : message
    })

    res.status(200).json({
        status :"success",
        data:{
            message
        }
    })


    }catch(err){
            res.status(400).json({
                status:"fail",
                data:{
                    message:err.message
                }
            })
    }


}

export const fetchMessage = async (req,res)=>{

    try{

        let message = await messageModel.find({chat:req.params.id}).populate("sender","name image email").populate("chat")
        res.status(200).json({
            status :"success",
            data:{
                message
            }
        })

    }catch(err){
        res.status(400).json({
            status:"fail1",
            data:{
                message:err.message
            }
        })
    }

}

export const fetchMessagepagination = async (req,res)=>{

    const { page = 1 } = req.query;
    const limit = 20

    try{

        let message = await messageModel.find({chat:req.params.id})
        .sort({createdAt :-1})
        .skip((page-1) * parseInt(limit))
        .limit(parseInt(limit))
        .populate("sender","name image email").populate("chat")
        res.status(200).json({
            status :"success",
            data:{
                message,
                totalmessages : await messageModel.countDocuments({chat:req.params.id}),
                maximumPage : Math.ceil(await messageModel.countDocuments({chat:req.params.id})/limit)
            }
        })


    }catch(err){
        res.status(400).json({
            status:"fail12",
            data:{
                message:err.message
            }
        })
    }

}