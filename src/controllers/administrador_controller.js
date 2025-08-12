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

const perfilAdmin = (req, res) => {
  try {
    const usuario = req.usuario;

    const datosPerfil = {
      _id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      estado: usuario.estado,
      confirmEmail: usuario.confirmEmail,
      fechaCreacion: usuario.fechaCreacion,
      fechaActualizacion: usuario.fechaActualizacion,
      token: usuario.token ? usuario.token : null,
    };

    return res.status(200).json(datosPerfil);
  } catch (error) {
    console.error("Error al obtener perfil admin:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

const actualizarPerfilAdmin = async (req, res) => {
  try {
    // El ID lo tomamos del usuario autenticado (middleware verificarTokenJWT)
    const id = req.usuario?._id || req.usuario?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "No se pudo determinar el usuario autenticado" });
    }

    const { nombre, apellido, telefono } = req.body;
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    // Actualizar campos básicos
    if (typeof nombre !== 'undefined') usuario.nombre = nombre;
    if (typeof apellido !== 'undefined') usuario.apellido = apellido;
    if (typeof telefono !== 'undefined') usuario.telefono = telefono;

    // Si viene una imagen nueva (campo 'imagen')
    if (req.files?.imagen) {
      // Elimina la anterior de Cloudinary si existe
      if (usuario.imagenID) {
        await cloudinary.uploader.destroy(usuario.imagenID);
      }

      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.imagen.tempFilePath,
        { folder: 'ImagenUsuario' }
      );

      usuario.imagen = secure_url;
      usuario.imagenID = public_id;

      await fs.unlink(req.files.imagen.tempFilePath);
    }

    await usuario.save();

    // Devuelve el usuario actualizado (con _id asegurado)
    const userResponse = usuario.toObject();
    userResponse._id = usuario._id;

    return res.status(200).json({ msg: "Perfil actualizado correctamente", usuario: userResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

const actualizarPasswordAdmin = async (req, res) => {
  const { id } = req.params;
  const { passwordAnterior, passwordNuevo } = req.body;

  try {
    // Validar campos obligatorios
    if (!passwordAnterior || !passwordNuevo) {
      return res.status(400).json({ msg: "La contraseña anterior y la nueva son obligatorias" });
    }

    // Validar ID de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    // Buscar usuario
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    // Verificar si la contraseña anterior coincide
    const coincide = await usuario.matchPassword(passwordAnterior);
    if (!coincide) {
      return res.status(400).json({ msg: "La contraseña anterior no coincide" });
    }

    // Cifrar la nueva contraseña y guardar
    usuario.password = await usuario.encrypPassword(passwordNuevo);
    await usuario.save();

    return res.status(200).json({ msg: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("❌ Error al actualizar la contraseña:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Usuario.find({ rol: "paciente" }).select("-password");
    return res.status(200).json(pacientes);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

const editarPaciente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono } = req.body;

  try {
    const paciente = await Usuario.findById(id);
    if (!paciente || paciente.rol !== "paciente") {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    paciente.nombre = nombre || paciente.nombre;
    paciente.apellido = apellido || paciente.apellido;
    paciente.telefono = telefono || paciente.telefono;

    await paciente.save();
    return res.status(200).json({ msg: "Paciente actualizado correctamente", paciente });
  } catch (error) {
    console.error("Error al editar paciente:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};
const darDeBajaPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Usuario.findById(id);
    if (!paciente || paciente.rol !== "paciente") {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    paciente.estado = false; // o paciente.activo = false;
    await paciente.save();

    return res.status(200).json({ msg: "Paciente dado de baja correctamente" });
  } catch (error) {
    console.error("Error al dar de baja paciente:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};



export{
    registro,
    activarCuenta,
    perfilAdmin,
    actualizarPerfilAdmin,
    actualizarPasswordAdmin,
    obtenerPacientes,
    editarPaciente,
    darDeBajaPaciente,

}