import {Router} from 'express'
import {registro, activarCuenta, perfilAdmin, actualizarPerfilAdmin, actualizarPasswordAdmin,obtenerPacientes,editarPaciente,darDeBajaPaciente} from '../controllers/administrador_controller.js'
import {verificarTokenJWT} from '../middlewares/JWT.js'
import {validarAdmin} from '../middlewares/VerificarAuth.js'
import { crearRecurso, obtenerRecursos, obtenerRecurso,actualizarRecurso, eliminarRecurso} from '../controllers/recurso_controller.js'
import {crearReporte, obtenerReportes, obtenerReportePorId, obtenerReportesPorPaciente, eliminarReporte} from '../controllers/reporte_controller.js';

const router = Router()
//Endpoint para registrar un administrador
router.post('/registrar',registro)
router.get('/activar/:token', activarCuenta)
//Endpoints para manejar el perfil del administrador
router.get('/perfil', verificarTokenJWT, validarAdmin, perfilAdmin)
router.put('/perfil/',verificarTokenJWT, validarAdmin, actualizarPerfilAdmin)
router.put('/actualizar-password/:id', verificarTokenJWT, validarAdmin, actualizarPasswordAdmin);
//Endpoints para manejar pacientes
router.get('/pacientes', verificarTokenJWT, validarAdmin, obtenerPacientes);
router.put('/pacientes/:id', verificarTokenJWT, validarAdmin, editarPaciente);
router.delete('/pacientes/baja/:id', verificarTokenJWT, validarAdmin, darDeBajaPaciente);
//Endpoints para manejar recursos
router.post('/recurso/crear', verificarTokenJWT, validarAdmin, crearRecurso);
router.get('/recurso/lista', verificarTokenJWT, validarAdmin, obtenerRecursos);
router.get('/recurso/:id', verificarTokenJWT, validarAdmin, obtenerRecurso);
router.put('/recurso/actualizar/:id', verificarTokenJWT, validarAdmin, actualizarRecurso);
router.delete('/recurso/eliminar/:id', verificarTokenJWT, validarAdmin, eliminarRecurso);
//Endpoints para manejar reportes
router.get('/reporte/obtener', verificarTokenJWT,obtenerReportes);
router.get('/reporte/obtener/:id',verificarTokenJWT, obtenerReportePorId);
router.get('/reporte/paciente/:pacienteId',verificarTokenJWT, obtenerReportesPorPaciente);
router.delete('/reporte/eliminar/:id', verificarTokenJWT,eliminarReporte);

export default router
