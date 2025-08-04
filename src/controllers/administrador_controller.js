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
    res.status(200).json({msg:"Usuario Creado"}, nuevoAdministrador)
}

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

//DESARROLLO DE LA INFORMACION PARA PERFIL DE ADMINISTRADOR Y ENVIO DE TODOS LOS PARAMETROS
const perfilAdmin = (req, res)=>{
    const {token, confirmEmail,createdAt, updateAt, __v, ...datosPerfil} = req.usuario;
    return res.status(200).json(datosPerfil)
}
const actualizarPerfilAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ msg: `Lo sentimos, ID inválido` });
    }

    // Validar campos obligatorios

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    // Proteger campos que no deben cambiarse
    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido
    usuario.telefono = telefono || usuario.telefono;

    await usuario.save();

    return res.status(200).json({ msg: "Perfil actualizado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
}
export{
    registro,
    activarCuenta,
    perfilAdmin,
    actualizarPerfilAdmin
}