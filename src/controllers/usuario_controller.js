import Usuario from "../models/Usuario.js"
import {sendMailToActiveAccount, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import { crearTokenJWT } from "../middlewares/JWT.js"

//Endpoint Iniciar Sesion
const login = async (req,res)=>{
    const {email,password,rol} = req.body
    //Validacion campos formulario vacio
    if(Object.values(req.body).includes("")){
        return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    }
    const usuarioBDD = await Usuario.findOne({email});

    //Validacion si existe el usuario
    if(!usuarioBDD) {
        return res.status(400).json({msg:"Usuario No Registrado. Registrese..."});
    }
    //Validacion de la contraseña
    const validPassword = await usuarioBDD.matchPassword(password);
    if (!validPassword) return res.status(401).json({ msg: "Contraseña incorrecta" });

    //Valida que el rol sea el correcto para el usuario
    if(rol !== usuarioBDD.rol) return res.status(401).json({msg:"El usuario no tiene permiso para ese perfil...."})
    
    //Validacion por cada rol
    if(usuarioBDD.rol === 'admin'){
        //Validacion si la cuenta no ha sido activada
        if(!usuarioBDD.confirmEmail){
            const token = usuarioBDD.crearToken();
            usuarioBDD.token = token
            await usuarioBDD.save();
            await sendMailToActiveAccount(email,token);
            return res.status(401).json({
                msg:"Tu cuenta no esta activa. Revisa tu correo para activarla"
            });
        } else{
            usuarioBDD.activo = true;
            await usuarioBDD.save()
            const token = crearTokenJWT(usuarioBDD._id, usuarioBDD.rol)
            return res.status(200).json({
          msg: "Usuario registrado. Bienvenido",
          token,
          usuario: {
            nombre: usuarioBDD.nombre,
            email: usuarioBDD.email,
            rol: usuarioBDD.rol
    }
});
        }       
    }else{
            //CODIGO PARA PACIENTE 
    }
    await usuarioBDD.save()

}
//Endpoint para registrar usuario pero solo Pacientes
const registrar = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;

    // Validar campos vacíos
    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    // Validar email con expresión regular
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        return res.status(400).json({ msg: "Formato de correo inválido" });
    }

    // Validar longitud mínima del password
    if (password.length < 6) {
        return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
        return res.status(400).json({ msg: "El usuario ya existe" });
    }

    try {
        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, apellido, email, password, rol:'paciente'});
        nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);

        // Generar token de activación y enviar email
        const token = nuevoUsuario.crearToken();
        nuevoUsuario.token = token
        await nuevoUsuario.save();
        await sendMailToActiveAccountPaciente(email, token);

        res.status(200).json({ msg: "Usuario registrado, revisa tu correo para activar la cuenta" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error en el registro" });
    }
};

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) {
        return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    }
    const usuarioBDD = await Usuario.findOne({email})
    if(!usuarioBDD) {
        return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    }
    const token = usuarioBDD.crearToken()
    usuarioBDD.token = token
    await sendMailToRecoveryPassword(email,token)
    await usuarioBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}
const comprobarTokenPassword = async (req,res)=>{
    const {token} = req.params
    const usuarioBDD = await Usuario.findOne({token})
    if(usuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await usuarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}
const crearNuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const usuarioBDD = await Usuario.findOne({token:req.params.token})
    if(usuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    usuarioBDD.token = null
    usuarioBDD.password = await usuarioBDD.encrypPassword(password)
    await usuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}


export{
    login,
    recuperarPassword,
    comprobarTokenPassword,
    registrar,
    crearNuevoPassword
}
    