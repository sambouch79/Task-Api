const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendConciliationEmail}=require('../emails/account')

const router=new express.Router()


router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.FirstName)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
     
})
router.post('/users/login',async(req,res)=>{
    try {
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
        
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
        
    }
})
router.get('/users/me',auth,async (req,res)=>{
   
      res.send(req.user)
     
})
router.get('/users/:id',async (req,res)=>{
    //console.log(req.params)
    const _id=req.params.id
    try {
        const user=await User.findById(_id)
        if(!user){
            return res.status(404).send(error)
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
    /* User.findById(_id).then((user)=>{
       if(!user){
           return res.status(404).send()
       }
       res.send(user)
    }).catch((err)=>{
       res.status(500).send(err)
    }) */
})

// update with patch
router.patch('/users/me',auth,async (req,res)=>{
    const updateFields=Object.keys(req.body)
    const updateAllowedField=['FirstName','LastName','age','password','email']
    const isValideOp=updateFields.every((update)=> updateAllowedField.includes(update))
    if(!isValideOp){
        return res.status(400).send({Error:'invalid updates!!!!'})
    }

    try {
        //const user=await User.findById(req.params.id)
        const user=req.user
        updateFields.forEach((update) => user[update]=req.body[update]);
        await user.save()
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true}) ne pas utiliser cette ecriture lors du hashage avec un middleware
        /* if(!user){
            return res.status(404).send(error)
        } */
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete with delete
router.delete('/users/me',auth,async (req,res)=>{
    try {
        await req.user.remove()
        sendConciliationEmail(req.user.email,req.user.FirstName)
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// upload File 


const upload=multer({
    //dest:'profil-image',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return callback(new Error('file is not valid'))
        }
        callback(undefined,true)
    }
})
router.post('/users/me/upload',auth,upload.single('image'),async(req,res)=>{
    //redimentionner l'image de profil avec sharp
    const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.imageProfile =buffer
    await req.user.save()
    res.send({message:'image loaded!!!'})
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/upload',auth,async(req,res)=>{
    req.user.imageProfile=undefined
    await req.user.save()
    res.send()
})
router.get('/users/:id/imageprofile',async(req,res)=>{
    try {
        const user =await User.findById(req.params.id)
        if(!user || !user.imageProfile){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.imageProfile)

    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports=router