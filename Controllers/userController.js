import userModel from "../Models/userModel.js";
import { mytoken } from "../webAuth.js";

export const userSignup =async (req,res)=>{
    try{
    const {name,email,password,image} = req.body
    if(!name || !email || !password){
       return res.status(400).json({
            status:"fail",
            message:"mandatory fields are missing"
        })
    }
    
    let user = await userModel.findOne({email})
    if(user){
       return res.status(400).json({
            status:"fail",
            message:"The email already exists"
        })
    }

    let createUser = await userModel.create({
        name,email,password,image
    })

    if(createUser){
        res.status(201).json({
            status:"success",
            token:mytoken(createUser._id),
            createUser
        })
    }

    }catch(err){
        res.status(400).json({
            status:"fail",
            err :err.message
        })
    }
    
}

export const userLogin = async(req,res)=>{
    try{
        const {email,password} = req.body

        let user = await userModel.findOne({email})

        if(user){
            const match = await user.comparePassword(password);
             if(match){
           return res.status(200).json({
                status:"success",
                user,
                token:mytoken(user._id)
            })
        }else{
            return res.status(200).json({
                status:"fail Invalid cred"
            })
        }

        }else{
             return res.status(200).json({
                status:"fail Invalid cred"
            })
        }
      
    }catch(err){
        res.status(400).json({
            status:"fail",
            err : err.message
        })
    }
}

export const allusers = async (req,res)=>{
  try{
    
    let keyword = req.query.search ? {
        $or:[
            {name :{$regex:req.query.search, $options:'i'}},
            {email :{$regex:req.query.search, $options:'i'}}
        ]
    }:{}

    let getAlluser = await userModel.find(keyword).find({_id:{$ne:req.user._id}});
    res.status(200).json({
        status:"success",
        getAlluser
    })
  }catch(err){
    res.status(400).json({
        status:"fail",
        error : err.message
    })
  }
     
}

export const updateUserStatus = async(userID,data)=>{
     try{
        await userModel.findByIdAndUpdate({_id:userID},{is_online:data})
     }catch(err){
        console.log(err)
     }
}

export const updateuserName = async(req,res)=>{
    try{
        let updatedUser = await userModel.findByIdAndUpdate({_id:req.user._id},{name:req.params.id})
        res.status(200).json({
            status:"success",
            updatedUser
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            error : err.message
        })
    }
}
export const updateuserImage = async(req,res)=>{
    let {imgUrl} = req.body
    try{
        let updatedUser = await userModel.findByIdAndUpdate({_id:req.user._id},{image:imgUrl})
        res.status(200).json({
            status:"success",
            updatedUser
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            error : err.message
        })
    }
}