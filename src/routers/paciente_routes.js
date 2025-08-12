/*
*/import express from 'express';
import {actualizarPasswordPaciente,actualizarPerfilPaciente, confirmarCuentaPaciente, perfilPaciente} from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js';
import {agendarCitaYpagar, agendarCitaEfectivo, misCitas, eliminarCita} from '../controllers/cita_controller.js';
import { obtenerRecursos , obtenerRecurso, utilizarRecurso } from '../controllers/recurso_controller.js';
import {  crearReporte, obtenerReportesPorPaciente } from '../controllers/reporte_controller.js';


const router = express.Router();
//Endpoint validar cuenta de paciente
router.get('/confirmar/:token',confirmarCuentaPaciente)

//Endpoint para obtener el perfil del paciente Y actualizarlo
router.get('/perfil', verificarTokenJWT,perfilPaciente);
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfilPaciente);
router.put('/actualizar-password/:id', verificarTokenJWT, actualizarPasswordPaciente);
//Endpoint para utilizar recurso que existe
router.get('/recurso/lista', verificarTokenJWT, obtenerRecursos);
router.get('/recurso/:id', verificarTokenJWT, obtenerRecurso);
router.post('/recurso/utilizar', verificarTokenJWT,utilizarRecurso);
//Endpoint para obtener reportes del paciente
router.get('/reporte/mis-reportes/:pacienteId', verificarTokenJWT, obtenerReportesPorPaciente);


//Endpoint para manejar citas
router.post('/cita/agendar-pagar', verificarTokenJWT, agendarCitaYpagar);

// Agendar con efectivo (pendiente)
router.post('/cita/agendar-efectivo', verificarTokenJWT, agendarCitaEfectivo);

// Listar mis citas
router.get('/cita/mis-citas', verificarTokenJWT, misCitas);

// Eliminar
router.delete('/cita/:id', verificarTokenJWT, eliminarCita);

export default router


