
import {Router} from 'express'
import {registro, activarCuenta} from '../controllers/administrador_controller.js'

const router = Router()

router.post('/registro',registro)
router.get('/activar/:token', activarCuenta)

export default router
