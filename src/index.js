const express=require ('express')
require('./db/mongoose')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app=express()
const port=process.env.PORT

//middleware to  upload file multer

//use middleware to parse  request data to json format automatiquelly
app.use(express.json())


//utiliser les routes dans le dossier routers
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log("server listening on port"+port)
})

 const Task=require('./models/task')
 const User=require('./models/user')
 const m=async()=>{
    /*  const task=await Task.findById('6069a8b8a5115e1fe46b7523')
     await task.populate('owner').execPopulate()
     console.log(task.owner) */
     const user=await User.findById('6069a7b9efea3826c0646252')
     await user.populate('tasks').execPopulate()
     console.log(user.tasks)
 }
 