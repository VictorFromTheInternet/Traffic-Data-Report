import nodeMailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodeMailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export default transporter