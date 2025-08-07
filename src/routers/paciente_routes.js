import express from 'express';
import {actualizarPerfilPaciente, confirmarCuentaPaciente, perfilPaciente} from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js';
import {agendarCita, eliminarCita, pagarCita} from '../controllers/cita_controller.js';
import { utilizarRecurso } from '../controllers/recurso_controller.js';
import {  crearReporte, obtenerMisReportes, obtenerReportesPorPaciente } from '../controllers/reporte_controller.js';
import { crearRespuestaCuestionario,
    obtenerRespuestasPorPaciente,
    obtenerRespuestaPorId} from '../controllers/respuesta_controller.js';

const router = express.Router();
//Endpoint validar cuenta de paciente
router.get('/confirmar/:token',confirmarCuentaPaciente)

//Endpoint para obtener el perfil del paciente Y actualizarlo
router.get('/perfil', verificarTokenJWT,perfilPaciente);
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfilPaciente);

//Endpoint para obtener reportes del paciente
router.get('/reporte/mis-reportes', verificarTokenJWT, obtenerReportesPorPaciente);
router.post('/reporte/crear', verificarTokenJWT,crearReporte);

//Endpoint para manejar citas
router.post('/agendar',verificarTokenJWT, agendarCita);
router.delete('/:id', verificarTokenJWT, eliminarCita);
router.post('/pagar', verificarTokenJWT, pagarCita);

router.post('/respuesta-cuestionario', verificarTokenJWT, crearRespuestaCuestionario);
router.get('/respuesta-cuestionario/paciente/:pacienteId', verificarTokenJWT, obtenerRespuestasPorPaciente);
router.get('/respuesta-cuestionario/:id', verificarTokenJWT, obtenerRespuestaPorId);

export default router


