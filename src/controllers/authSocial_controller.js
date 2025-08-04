import {crearTokenJWT} from '../middlewares/JWT.js'

const authSocialCallback = async (req, res)=>{
    try {
        if(!req.usuario) return res.status(400).json({msg:"No se encontro el usuario"});
        const token = crearTokenJWT(req.usuario._id, req.usuario.rol);
        res.json({
            token,
            usuario:{
                id: req.usuario._id,
                nombre: req.usuario.nombre,
                correo: req.usuario,correo,
                rol: req.usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en authSocialCallback:', error);
    res.status(500).json({ msg: 'Error al autenticar con red social' });
    }
}
export{
    authSocialCallback
}