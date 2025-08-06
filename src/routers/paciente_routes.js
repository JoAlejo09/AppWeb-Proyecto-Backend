import express from 'express';
import {actualizarPerfilPaciente, confirmarCuentaPaciente, perfilPaciente} from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js';
import {agendarCita, eliminarCita, pagarCita} from '../controllers/cita_controller.js';

const router = express.Router();
router.get('/confirmar/:token',confirmarCuentaPaciente)

router.get('/perfil', verificarTokenJWT,perfilPaciente);
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfilPaciente);

router.post('/agendar',verificarTokenJWT, agendarCita);
router.delete('/:id', verificarTokenJWT, eliminarCita);
router.post('/pagar', verificarTokenJWT, pagarCita);

export default router;