const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_KEY)


const sendWelcomeEmail=(email,name)=>{
    console.log('send email to'+ email)
    sgMail.send({
        to: email, //  your recipient
        from: process.env.EMAIL, //  verified sender
        subject: 'Welcome email ',
        text: `Hi, thank you for join us,${name}, enjoy`
    }).then(()=>{
        console.log('email sent')
    }).catch((error)=>{
        console.log(error)
    })
}
const sendConciliationEmail=(email,name)=>{
    sgMail.send({
        to: email, //  your recipient
        from: process.env.EMAIL, //  verified sender
        subject: 'Conciliation email',
        text: `Hi, your compte is deleted ,${name}, you can create a new account again ` 
    }).then(()=>{
        console.log('email sent')
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports={
    sendWelcomeEmail,
    sendConciliationEmail
}  