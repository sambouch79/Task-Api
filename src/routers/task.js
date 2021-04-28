const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()



router.post('/tasks',auth,async (req,res)=>{
    const task=new Task({
        ...req.body,
        'owner':req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})


router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try {
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send(error)
        }
        res.status(200).send(task)
    } catch (error) {
       res.status(500).send(error) 
    }
  
}) 
/* app.get('/tasks/:description',(req,res)=>{
    const _description=req.params.description
    console.log(_description)
    Task.findOne({description:_description}).then((task)=>{
        if(!task){
            return res.status(404).send()
        }
        res.send(task) 
    }).catch((err)=>{
        res.status(500).send(err)
    })
}) */

router.get('/tasks',auth,async (req,res)=>{
    const match={}
    const sort={}
    if(req.query.sortBy){
       const parts=req.query.sortBy.split('_')
        console.log(parts)
        sort[parts[0]]=parts[1]==='desc'?-1:1
    } 
    if(req.query.Completed){
          match.Completed=req.query.Completed==='true'
    }
    try {
       // const tasks=await  Task.find(owner:req.user._id)
       //await req.user.populate('tasks').execPopulate()
       await req.user.populate({
           path:'tasks',
           match,
           options:{
               limit:parseInt(req.query.limit),
               skip:parseInt(req.query.skip),
               sort
           }
       }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(err)  
    }

})

router.patch('/tasks/:id',auth,async (req,res)=>{
const updateFields=Object.keys(req.body)
const allowedFields=['description','Completed']

const IsValideOp=updateFields.every((update)=> allowedFields.includes(update))

if(! IsValideOp){
    return res.status(400).send({Error:'invalid updates!!!'})
}

try {
    const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
   

     //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
     if(!task){
         return res.status(404).send(error)
     }
     updateFields.forEach((update)=>task[update]=req.body[update])
     await task.save()
     res.status(200).send(task)
 } catch (error) {
     res.status(400).send(error)
 }

})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try {
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(400).send({error:'task not found'})
        }
        res.send(task)
    } catch (e) {
         res.status(400).send(e)
    }
})
 module.exports=router