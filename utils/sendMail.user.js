import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()


const sendVerificationMail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: process.env.MAILTRAP_SECURE, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

    const mailOption = {
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: email,
        subject: "Verify your email", // Subject line
        text: `Please click on the following link:
        ${process.env.BASE_URL}/api/v1/users/verify/${token}
        `,
      };

      

    try {
        await transporter.sendMail(mailOption);
    } catch (error) {
        console.log(`Error accured while sending verification email`)
    }
}

export default sendVerificationMail;