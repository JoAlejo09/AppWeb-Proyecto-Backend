import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToActiveAccount = (userMail, token)=>{
    let mailOptions = {
        from: 'Sistema Salud Mental ESFOT" <no-reply@esfot.edu.ec>',
        to: userMail,
        subject: "Activacion Usuario Administrador",
        html:`
        <p>Hola Administrador,</p>
        <p>Estas accediendo por primera vez a tu cuenta<a href="${process.env.URL_FRONTEND}admin/activar/${token}">aqui</a> para activar tu cuenta</p>
        <hr>
        <footer>El equipo te da la bienvenida</footer>
        `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
        }
    })
}
const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
        from: 'Sistema Salud Mental ESFOT" <no-reply@esfot.edu.ec>',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Mental App
        <hr>
        <a href=${process.env.URL_FRONTEND}nuevo-password/${token}> Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>El equipo de SmartVET te da la más cordial bienvenida.</footer>
        `   
    })
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);

}

/*const sendMailToRegister = (userMail, token) => {

    let mailOptions = {
        from: 'notificacion.mentalapp@epn.edu.com',
        to: userMail,
        subject: "SmartVET -🐶 😺",
        html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}admin/confirmar/${token}">aquí</a> para confirmar tu cuenta.</p>
        <hr>
        <footer>El equipo de SmartVET te da la más cordial bienvenida.</footer>
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
        }
    })
}

*/
export {
    sendMailToActiveAccount,
//    sendMailToRegister,
    sendMailToRecoveryPassword
}
