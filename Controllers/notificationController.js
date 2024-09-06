import notificationModel from "../Models/NotificationModel.js";

export const sendNotification = async (req,res)=>{
   let {chatId,userId} = req.body
   if(!chatId || !userId){
    return res.status(400).json({
        status:"fail",
        message:"please provide chatId and userID"
    })
   }
   try{
    let createdData = {
        Users : userId,
        selectedChatID : chatId
    }
     let data = await notificationModel.create(createdData)
     res.status(200).json({
        status:"success",
        data
     })
   }catch(err){
    res.status(400).json({
        status:"fail",
        message:err.message
    })
   }
}

export const fetchNotification = async(req,res)=>{
    let userID = req.user._id
    try{
      
         let data = await notificationModel.find({Users:userID})
         res.status(200).json({
            status:"success",
            data
         })
       }catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
       }
    
}
export const deleteNotification = async(req,res)=>{
    let {chatId} = req.body
    try{
       await notificationModel.deleteMany({Users:req.user._id,selectedChatID:chatId})
       res.status(200).json({
        status: 'success',
        message: 'Notifications deleted successfully'
    });
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message:err.message
        })
    }
}