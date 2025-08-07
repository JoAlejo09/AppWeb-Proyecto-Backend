import express from 'express';
import {actualizarPerfilPaciente, confirmarCuentaPaciente, perfilPaciente} from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js';
import {agendarCita, eliminarCita, pagarCita} from '../controllers/cita_controller.js';
import { utilizarRecurso } from '../controllers/recurso_controller.js';
import { obtenerMisReportes } from '../controllers/reporte_controller.js';

const router = express.Router();
//Endpoint validar cuenta de paciente
router.get('/confirmar/:token',confirmarCuentaPaciente)

//Endpoint para obtener el perfil del paciente Y actualizarlo
router.get('/perfil', verificarTokenJWT,perfilPaciente);
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfilPaciente);
//Enpoint para manejar recursos
router.post('/recurso/utilizar/:id', verificarTokenJWT, utilizarRecurso);
//Endpoint para obtener reportes del paciente
router.get('/reporte/mis-reportes', verificarToken, obtenerMisReportes);

//Endpoint para manejar citas
router.post('/agendar',verificarTokenJWT, agendarCita);
router.delete('/:id', verificarTokenJWT, eliminarCita);
router.post('/pagar', verificarTokenJWT, pagarCita);

export default router;