import {Router} from 'express'
import {registrar,  login, recuperarPassword,comprobarTokenPassword,crearNuevoPassword} from '../controllers/usuario_controller.js'

const router = Router()

router.post("/registrar", registrar);
router.post('/login',login)
router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPassword)
router.post('/nuevopassword/:token',crearNuevoPassword)


export default router
