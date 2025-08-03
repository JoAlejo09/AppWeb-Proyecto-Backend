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
const obtenerPerfilPaciente = (req, res) => {
  const {
    token,
    confirmEmail,
    password,
    __v,
    createdAt,
    updatedAt,
    ...datosPerfil
  } = req.usuario;

  res.status(200).json(datosPerfil);
};

export{
    confirmarCuentaPaciente,
    obtenerPerfilPaciente,

}