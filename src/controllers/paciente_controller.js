import Usuario from "../models/Usuario";

const activarCuentaPaciente = async (req,res)=>{
    const{token} = req.params;

    try{
        const pacienteBDD = await Usuario.findOne({token});
        if(!pacienteBDD) return res.status(404).json()
    }catch(error){

    }
}