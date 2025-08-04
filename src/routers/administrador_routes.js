
import {Router} from 'express'
import {registro, activarCuenta, perfilAdmin, actualizarPerfilAdmin, actualizarPasswordAdmin,obtenerPacientes,editarPaciente,darDeBajaPaciente} from '../controllers/administrador_controller.js'
import {verificarTokenJWT} from '../middlewares/JWT.js'
import {validarAdmin} from '../middlewares/VerificarAuth.js'
import { crearRecurso, obtenerRecursos, obtenerRecurso,actualizarRecurso, eliminarRecurso} from '../controllers/recurso_controller.js'

const router = Router()

router.post('/registrar',registro)
router.get('/activar/:token', activarCuenta)

router.get('/perfil', verificarTokenJWT, validarAdmin, perfilAdmin)
router.put('/perfil/:id',verificarTokenJWT, validarAdmin, actualizarPerfilAdmin)
router.put('/actualizar-password/:id', verificarTokenJWT, validarAdmin, actualizarPasswordAdmin);

router.get('/pacientes', verificarTokenJWT, validarAdmin, obtenerPacientes);
router.put('/pacientes/:id', verificarTokenJWT, validarAdmin, editarPaciente);
router.delete('/pacientes/baja/:id', verificarTokenJWT, validarAdmin, darDeBajaPaciente);

router.post('/recurso/crear', verificarTokenJWT, validarAdmin, crearRecurso);
router.get('/recurso/lista', verificarTokenJWT, validarAdmin, obtenerRecursos);
router.get('/recurso/:id', verificarTokenJWT, validarAdmin, obtenerRecurso);
router.put('/recurso/actualizar/:id', verificarTokenJWT, validarAdmin, actualizarRecurso);
router.delete('/recurso/eliminar/:id', verificarTokenJWT, validarAdmin, eliminarRecurso);

export default router
