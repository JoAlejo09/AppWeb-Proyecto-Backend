import Usuario from "../models/Usuario.js"
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

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

    // Validar ID de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    // Buscar al usuario por ID
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    // Validación de campos requeridos (opcional)
    if (!nombre || !apellido) {
      return res.status(400).json({ msg: "Nombre y apellido son obligatorios" });
    }

    // Proteger campos que no deben cambiarse
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.telefono = telefono || usuario.telefono;

    await usuario.save();

    return res.status(200).json({
      msg: "Perfil actualizado correctamente",
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};
const actualizarPasswordAdmin = async (req, res) => {
  const { id } = req.params;
  const { passwordAnterior, passwordNuevo } = req.body;
  try {
    if (!passwordAnterior || !passwordNuevo) {
      return res.status(400).json({ msg: "La contraseña anterior y la nueva son obligatorias" });
    }
    // Validar ID de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }
    // Buscar al usuario por ID
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }
    const passAnterior =  Usuario.encrypPassword(passwordAnterior)
    // Validar contraseña anterior
    if (usuario.matchPassword(passAnterior)) {
      // Cifrar la nueva contraseña
      usuario.password = await usuario.encrypPassword(passwordNuevo);
      await usuario.save();
      return res.status(200).json({ msg: "Contraseña actualizada correctamente" });
    }else {
      return res.status(400).json({ msg: "La contraseña anterior no coincide" });
    }

  } catch (error) {
    console.error("Error al validar ID:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
}
export{
    registro,
    activarCuenta,
    perfilAdmin,
    actualizarPerfilAdmin,
    actualizarPasswordAdmin
}