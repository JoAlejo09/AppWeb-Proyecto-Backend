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

const sendMailToActiveAccount = (userMail, token) => {
  let mailOptions = {
    from: '"MentalAPP - ESFOT" <no-reply@esfot.edu.ec>',
    to: userMail,
    subject: "Activación de cuenta de administrador",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Activación de Cuenta</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
        <h2>¡Bienvenido a MentalAPP!</h2>
        <p>Hola Administrador,</p>
        <p>Has sido registrado como administrador en la plataforma de salud mental de ESFOT.</p>
        <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <p>
          <a href="${process.env.URL_FRONTEND}admin/activar/${token}" 
             style="display: inline-block; padding: 10px 20px; background-color: #6b46c1; color: white; text-decoration: none; border-radius: 5px;">
            Activar cuenta
          </a>
        </p>
        <p>Si no solicitaste este acceso, puedes ignorar este mensaje.</p>
        <hr>
        <footer style="font-size: 0.9em; color: #777;">El equipo de MentalAPP - ESFOT</footer>
      </body>
      </html>
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
const sendMailToRecoveryPassword = async (userMail, token) => {
  const resetLink = `${process.env.URL_FRONTEND}nuevo-password/${token}`;

  try {
    const info = await transporter.sendMail({
      from: '"MentalAPP - ESFOT" <no-reply@esfot.edu.ec>',
      to: userMail,
      subject: "Reestablece tu contraseña - MentalAPP",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Reestablecer contraseña</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #6b46c1;">MentalAPP - Recuperación de contraseña</h2>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú quien la solicitó, haz clic en el siguiente botón:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #6b46c1; color: white; text-decoration: none; border-radius: 5px;">
                Restablecer contraseña
              </a>
            </p>
            <p>O copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all;">${resetLink}</p>
            <hr>
            <p style="font-size: 0.9em; color: #777;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            <footer style="font-size: 0.9em; color: #999; text-align: center;">
              El equipo de MentalAPP - ESFOT
            </footer>
          </div>
        </body>
        </html>
      `
    });
    console.log("Mensaje enviado satisfactoriamente:", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

const sendMailToActiveAccountPaciente = async (userMail, token) =>{
    let mailOptions ={
        from: '"MentalAPP - ESFOT" <no-reply@esfot.edu.ec>',
        to: userMail,
        subject: "Activación de cuenta de administrador",
        html:`
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hola 👋,</h2>
                <p>Gracias por registrarte en nuestra plataforma de seguimiento de salud mental.</p>
                <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/pacientes/confirmar/${token}" 
                    style="display:inline-block;padding:10px 20px;margin:20px 0;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;">
                Activar cuenta
                </a>
                <p>Si tú no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
                <br />
                <p>Equipo de Soporte ESFOT 🏥</p>
            </div>`   
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
        }
    })
}
export {
    sendMailToActiveAccount,
    sendMailToRecoveryPassword,
    sendMailToActiveAccountPaciente
}