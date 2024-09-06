import chatModel from "../Models/ChatModel.js"
import { Schema } from "mongoose"
import userModel from "../Models/userModel.js"

export const accessChat = async (req,res)=>{
    const {userID} = req.body
    if(!userID){
        res.status(400).json({
            status:"fail",
            message:'Please provide user'
        })
    }
    let isChat = await chatModel.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userID}}}
        ]
    }).populate("users","-password").populate("latestMessage")
    //let myChat = await chatModel.findById(isChat[0]._id).populate('users')

    isChat = await userModel.populate(isChat,{
        path : "latestMessage.sender",
        select : "name email image"
    })

    if(isChat.length>0){
        res.send(isChat[0])
    }else{
        let chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userID]
        };
        try{
           let createChat = await chatModel.create(chatData);
           let fullChat = await chatModel.findById(createChat._id)

           res.status(200).send(fullChat)
        }catch(err){
           res.status(400).send(err)
        }
    }
    

}

export const fetchChats = async (req,res)=>{

    try{

        let myChats = await chatModel.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password').populate('groupAdmin','-password')
        .populate('latestMessage').sort({updatedAt : -1})

        myChats = await userModel.populate(myChats,{
            path:'latestMessage.sender',
            select:'name email image'
        })

          res.status(200).json({
            status:'success',
            myChats
        })

    }catch(err){
        res.status(400).json({
            status:'fail',
            err
        })
    }

}

export const createGroupChat = async(req,res)=>{
   if(!req.body.name || !req.body.users){
    res.status(200).json({
        status:"failed",
        message:"Please enter required field"
    })
   }
    // const users = JSON.parse(req.body.users)
    const users = req.body.users
    if(users.length<2){
          res.status(200).json({
        status:"failed",
        message:"Please add more 2 or more members to form a group."
    })
    }

    users.push(req.user)
    
    try{
        const groupChat = await chatModel.create({
            chatName : req.body.name,
            users ,
            isGroupChat : true,
            groupAdmin:req.user
        })

        const fullGroupChat = await chatModel.findById(groupChat._id)
        .populate('users','-password').populate('groupAdmin','-password');

        res.status(200).send(fullGroupChat)
    }catch(err){
           res.status(200).json({
        status:"failed",
        message:"cant create group chat"
    })
    }
   
}

export const renameGroup = async (req,res)=>{
    const {chatID, chatName} = req.body
    if(!chatID || !chatName){
        res.status(400).json({
            status : "failed",
            message : "Please provide required field"
        })
    }

    try{
     let updateChat = await chatModel.findByIdAndUpdate(chatID,{
        chatName
     },{
        new:true
     }).populate('users','-password').populate('groupAdmin','-password')

      res.status(200).json({
             status : "success",
            updateChat
        })
    }catch(err){
        res.status(400).json({
             status : "failed",
            message : "something went wrong"
        })
    }
}

export const addToGroup = async (req,res)=>{
   const {chatId ,user} = req.body
     if(!chatId || !user){
        res.status(400).json({
            status : "failed",
            message : "Please provide required field"
        })
    }

    let users = user

    try{

        let {users:allUsers} = await chatModel.findById(chatId)
        if(!allUsers.includes(users)){
            console.log("true")
        

        let updatedChat = await chatModel.findByIdAndUpdate(chatId,{
            $push:{users:users}
        },{
            new:true
        }).populate('users','-password').populate('groupAdmin','-password');
        
        res.status(200).json({
            status:'success',
            updatedChat
        })
    }else{
        throw new Error("User is already a part of this chat");
    }

    }catch(err){
        res.status(400).json({
            status:'fail',
            message : err.message || 'An unknown error occurred'
        })
    }
}

export const removeFromGroup = async (req,res)=>{
   const {chatId ,user} = req.body
     if(!chatId || !user){
        res.status(400).json({
            status : "failed",
            message : "Please provide required field"
        })
    }

    try{

        let updatedChat = await chatModel.findByIdAndUpdate(chatId,{
            $pull:{users:user}
        },{
            new:true
        }).populate('users','-password').populate('groupAdmin','-password');
        
        res.status(200).json({
            status:'success',
            updatedChat
        })


    }catch(err){
        res.status(400).json({
            status:'fail',
            err
        })
    }
}