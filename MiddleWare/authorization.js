import jwt from "jsonwebtoken"
import userModel from "../Models/userModel.js"

export const protect = async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1]
            const decodeToken = jwt.verify(token,process.env.SECERET_STRING);
            req.user = await userModel.findById(decodeToken.id).select("-password");
            next()
        }catch(err){
            res.status(400).json({
                status:"failed",
                err
            })
        }
    }
}
