import express from 'express';
import {actualizarPasswordPaciente,actualizarPerfilPaciente, confirmarCuentaPaciente, perfilPaciente} from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js';
import {agendarCita, eliminarCita, pagarCita} from '../controllers/cita_controller.js';
import { utilizarRecurso } from '../controllers/recurso_controller.js';
import {  crearReporte, obtenerMisReportes, obtenerReportesPorPaciente } from '../controllers/reporte_controller.js';


const router = express.Router();
//Endpoint validar cuenta de paciente
router.get('/confirmar/:token',confirmarCuentaPaciente)

//Endpoint para obtener el perfil del paciente Y actualizarlo
router.get('/perfil', verificarTokenJWT,perfilPaciente);
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfilPaciente);
router.put('/actualizar-password/:id', verificarTokenJWT, actualizarPasswordPaciente);
//Endpoint para utilizar recurso que existe
router.post('/recurso/utilizar', verificarTokenJWT,utilizarRecurso);
//Endpoint para obtener reportes del paciente
router.get('/reporte/mis-reportes/:id', verificarTokenJWT, obtenerReportesPorPaciente);


//Endpoint para manejar citas
router.post('/agendar',verificarTokenJWT, agendarCita);
router.delete('/:id', verificarTokenJWT, eliminarCita);
router.post('/pagar', verificarTokenJWT, pagarCita);

export default router


