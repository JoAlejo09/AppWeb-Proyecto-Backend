import Usuario from "../models/Usuario.js";

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
    const usuario = req.usuario;

    const datosPerfil = {
      id: usuario._id,
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
    console.error("Error al obtener perfil Paciente:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};
const actualizarPerfilPaciente = async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body;
    const paciente = await Usuario.findById(req.usuario._id);

    if (!paciente || paciente.rol !== "paciente") {
      return res.status(403).json({ msg: "Acceso denegado" });
    }

    paciente.nombre = nombre || paciente.nombre;
    paciente.apellido = apellido || paciente.apellido;
    paciente.telefono = telefono || paciente.telefono;

    await paciente.save();
    return res.status(200).json({ msg: "Perfil actualizado", paciente });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};

export{
    confirmarCuentaPaciente,
    perfilPaciente,
    actualizarPerfilPaciente

}