import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
/*
const crearTokenJWT =(id, rol) =>{
    return jwt.sign({id, rol}, process.env.JWT_SECRET,{
        expiresIn: "2h" || "1d"
    });
}

const verificarTokenJWT = async (req, res, next) =>{
    const {authorization} = req.headers;

    if(!authorization) {
        return res.status(401).json({msg:"Acceso denegado: Token no proporcionado o invalido"})
    }

    try{
        const token = authorization.split(" ")[1];
        const {id, rol} = jwt.verify(token, process.env.JWT_SECRET)

        const usuarioBDD = await Usuario.findById(id).lean().select("-password");
        if (!usuarioBDD){
            return res.status(404).json({msg: "Usuario no encontrado"})
        }
        if(rol !== "admin"){
            return res.status(401).json({msg: "Rol no autorizado"})
        }
        req.usuario = usuarioBDD
        next()
    }catch(error){
        return res.status(401).json({msg:"Tonken invalido o expirado"})
    }
}*/
// middlewares/JWT.js
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
        expiresIn: "2h"
    });
};

const verificarTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Token no proporcionado o inválido" });
    }

    try {
        const token = authorization.split(" ")[1];
        const { id, rol } = jwt.verify(token, process.env.JWT_SECRET);

        const usuarioBDD = await Usuario.findById(id).select("-password");
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        req.usuario = usuarioBDD; // Aquí lo guardas para siguientes middlewares
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido o expirado" });
    }
};

export{
    crearTokenJWT,
    verificarTokenJWT
}