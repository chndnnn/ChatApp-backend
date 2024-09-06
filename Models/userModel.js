import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    is_online:{
        type:Boolean,
        required : true,
        default : false
    }
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
if (!this.isModified('password')) return next();
 try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
})

userSchema.methods.comparePassword = async function(enterPass){
    return await bcrypt.compare(enterPass,this.password)
}

const userModel = mongoose.model('users',userSchema)
export default userModel