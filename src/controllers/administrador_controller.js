import Usuario from "../models/Usuario.js"
import jwt from 'jsonwebtoken'


//REGISTRO PERMITE AGREGAR USUARIOS PARA ADMINISTRADOR !SOLO ES PARA LA BASE DE DATOS !! NO PARA FRONTEND
const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Usuario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoAdministrador = new Usuario(req.body)
    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password)
    if(!nuevoAdministrador.rol=='admin')return res.status(401).json({msg:"Lo sentimos no se puede crear el usuario"})
    const token = nuevoAdministrador.crearToken()
//    await sendMailToRegister(email,token)
    await nuevoAdministrador.save()
//    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
    res.status(200).json({msg:"Usuario Creado"})
}

/*
const login = async (req,res)=>{
    const {email, password} = req.body
    //VALIDA CAMPOS VACIOS
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const administradorBDD = await Usuario.findOne({email});
    //VALIDA SI EXISTE EL USUARIO
    if(!administradorBDD) return res.status(400).json({msg:"Usuario No Encontrado"});    
    //VALIDA QUE EL ROL ELEGIDO SEA EL CORRECTO
    if(!req.rol === administradorBDD.rol) return res.status(401).json({msg:"El usuario no tiene permiso para ese perfil"})
    if (!administradorBDD.confirmEmail){
        const token = administradorBDD.crearToken();
        await sendMailToActiveAccount(email,token);
        return res.status(401).json({
            msg:"Tu cuenta no esta activa. Revisa tu correo para activarla"
        });
    }
    //VALIDA PASSWORD
    const validPassword = await administradorBDD.matchPassword(password);
    if (!validPassword) return res.status(401).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
        {id: administradorBDD._id, email:administradorBDD.email},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    );
    
    res.json({ token, usuario: { email: usuario.email, nombre: usuario.nombre } });
}*/
const activarCuenta = async (req, res) =>{
    const token = req.params.token
        console.log(token)
    const administradorBDD = await Usuario.findOne({token})
    if(!administradorBDD?.token){
        return res.status(404).json({msg:"El adminisitrador ya ha sido confirmado....."})
    }
    administradorBDD.token = null
    administradorBDD.confirmEmail = true
    await administradorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 

}
export{
    registro,
    activarCuenta
}