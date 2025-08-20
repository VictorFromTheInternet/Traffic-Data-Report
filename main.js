import transporter from "./services/nodeMailer.js"
import dotenv from 'dotenv'
dotenv.config()

async function sendEmail(){
    try{
        const mailOptions = {
            from: process.env.SMTP_SENDER_ID,
            to:  'vma0430@gmail.com',
            subject: '👋 Welcome to my app!',
            text:'Hello World!'
        }
        
        await transporter.sendMail(mailOptions)
        console.log('Email Sent!')
    }catch(err){
        console.error(err)
    }    

}
sendEmail()        