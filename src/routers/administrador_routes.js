
import {Router} from 'express'
import {registro, activarCuenta, perfilAdmin, actualizarPerfilAdmin} from '../controllers/administrador_controller.js'
import {verificarTokenJWT} from '../middlewares/JWT.js'
import {validarAdmin} from '../middlewares/VerificarAuth.js'

const router = Router()

router.post('/registro',registro)
router.get('/activar/:token', activarCuenta)

router.get('/perfil', verificarTokenJWT, validarAdmin, perfilAdmin)

router.put('/perfil/:id',verificarTokenJWT, (req,res,next)=>{
    if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado' });
  }
  next();
}, actualizarPerfilAdmin)

export default router
