const mongoose = require('mongoose')
var validator = require('validator');
mongoose.connect(process.env.MONGODB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true ,
    useFindAndModify:false
})
/* const User=mongoose.model('User',{
    name:{
        type:String
    },
    age:{
        type:Number
    }
})

const user1=new User({
    name:'Max',
    age:9
})
user1.save().then((result)=>{
console.log(result)
}).catch((err)=>{
console.log('Error:',err._message)
}) */
//creation de model
/* const Task=mongoose.model('Task',{
    description:{
        type:String,
        trim:true,
        required:true
    },
    Completed:{
        type:Boolean,
        default:false
    }
}) */
//instancier un nouveau object de la classe Task
/* const task1=new Task({
    description:'do exercises',
    Completed:true
})
task1.save().then(()=>{
    console.log(task1)
}).catch((err)=>{
    console.log(err._message)
}) */
/* const User=mongoose.model('User',{
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
        validate(value){
            if(value<18){
                throw new Error('age  must be over 18 ')
            }
        }
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

    }
})
 */
/*  const user1=new User({
     FirstName:'max   ',
     LastName:'   fifi',
     age:42,
     email:'max@gmail.com',
     password:'maxfifille'
 })
 user1.save().then((result)=>{
     console.log(result)
 }).catch((err)=>{
     console.log(err)
 }) */