const mongoose = require('mongoose')
var validator = require('validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema=new mongoose.Schema({
    
        FirstName:{
            type:String,
            require:true,
            trim:true,
            lowercase:true,
            
        },
        LastName:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
        },
        email:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            validate(value){
              if(!validator.isEmail(value)){
                  throw new Error('the email is not valide')
              }
    
            }
        },
        age:{
            type:Number,
            default:0,
         
        },
        password:{
            type:String,
            trim:true,
            required:true,
            minLength:6,
            validate(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error('password cannot contain "password"')
                }
            }
        },
        imageProfile:{
                type:Buffer
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }]
    
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON= function(){
    const user=this
    const userObj=user.toObject()
    delete userObj.password
    //delete userObj._id
    delete userObj.tokens
    delete userObj.imageProfile
    console.log(userObj)
    return userObj
}
userSchema.methods.generateAuthToken=async function(){
   const user=this
   //creation de token
   const token=jwt.sign({_id:user._id.toString()},process.env.JWT_TOKEN)
   
   //ajouter le token au user
   user.tokens=user.tokens.concat({token})
   //sauvgarder les modifications
   await user.save()
  
return token

}
userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}
//delete tasks when user is remove
userSchema.pre('remove',async function(req,res,next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})
userSchema.pre('save', async function(next){
      const user=this
      if (user.isModified('password')) {
        user.password=await bcrypt.hash(user.password,8) 
      }    
 next()
})
const User=mongoose.model('User',userSchema)
module.exports = User