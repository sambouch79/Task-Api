const mongoose = require('mongoose')
var validator = require('validator');

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    Completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})
taskSchema.pre('save',async function(next){
    const task=this
    next()
})
const Task=mongoose.model('Task',taskSchema)
module.exports=Task