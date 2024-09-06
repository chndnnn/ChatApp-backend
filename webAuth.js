import jwt from "jsonwebtoken"

export const mytoken = (id)=>{
       return jwt.sign({id},process.env.SECERET_STRING,{
        expiresIn:process.env.EXPIRE_IN
    })
}
