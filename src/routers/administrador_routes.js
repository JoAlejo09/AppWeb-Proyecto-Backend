
import {Router} from 'express'
import {registro, activarCuenta, perfilAdmin, actualizarPerfilAdmin, actualizarPasswordAdmin} from '../controllers/administrador_controller.js'
import {verificarTokenJWT} from '../middlewares/JWT.js'
import {validarAdmin} from '../middlewares/VerificarAuth.js'

const router = Router()

router.post('/registrar',registro)
router.get('/activar/:token', activarCuenta)

router.get('/perfil', verificarTokenJWT, validarAdmin, perfilAdmin)
router.put('/perfil/:id',verificarTokenJWT, validarAdmin, actualizarPerfilAdmin)
router.put('/actualizar-password/:id', verificarTokenJWT, validarAdmin, actualizarPasswordAdmin);

export default router
