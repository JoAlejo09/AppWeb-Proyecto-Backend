import Usuario from "../models/Usuario.js";
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

const confirmarCuentaPaciente = async (req,res)=>{
    const{token} = req.params;

    try{
        const pacienteBDD = await Usuario.findOne({token});
        if(!pacienteBDD) return res.status(404).json({msg:"Token invalido o cuenta ya registrada"});
        if(pacienteBDD.rol !== 'paciente') return res.status(403).json({msg:"No se tiene permiso para confirmar con esta cuenta "});
        pacienteBDD.token = null;
        pacienteBDD.confirmEmail = true;
        await pacienteBDD.save();
        res.status(200).json({ msg: "Cuenta de paciente confirmada exitosamente. Ya puedes iniciar sesión." });

    }catch(error){
        console.log(error);
        res.status(500).json({msg:"Error al confirmar la cuenta"});
    }
}
const perfilPaciente = (req, res) => {
  try {
    const u = req.usuario;

    // Mejor devolver campos que realmente existan
    return res.status(200).json({
      _id: u._id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      telefono: u.telefono,
      rol: u.rol,
      activo: u.activo,          // en tu modelo existe "activo"
      confirmEmail: u.confirmEmail,
      imagen: u.imagen || null,
      imagenIA: u.imagenIA || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    });

  } catch (error) {
    console.error("Error al obtener perfil Paciente:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

const actualizarPerfilPaciente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario || usuario.rol !== 'paciente') {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    usuario.nombre = nombre ?? usuario.nombre;
    usuario.apellido = apellido ?? usuario.apellido;
    usuario.telefono = telefono ?? usuario.telefono;

    // Si viene una nueva imagen
    if (req.files?.imagen) {
      // elimina imagen previa en cloudinary (si existe)
      if (usuario.imagenID) {
        await cloudinary.uploader.destroy(usuario.imagenID);
      }

      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.imagen.tempFilePath,
        { folder: "ImagenUsuario" }
      );

      usuario.imagen = secure_url;
      usuario.imagenID = public_id;

      // limpiar tmp
      await fs.unlink(req.files.imagen.tempFilePath);
    }

    await usuario.save();

    return res.status(200).json({
      msg: "Perfil actualizado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        imagen: usuario.imagen || null,
        imagenIA: usuario.imagenIA || null
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

export{
    confirmarCuentaPaciente,
    perfilPaciente,
    actualizarPerfilPaciente

}