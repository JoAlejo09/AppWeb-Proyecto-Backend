import express from 'express';
import {actualizarPerfilPaciente, confirmarCuentaPaciente, perfilPaciente} from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = express.Router();
router.get('/confirmar/:token',confirmarCuentaPaciente)

router.get('/perfil', verificarTokenJWT,perfilPaciente);
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfilPaciente);

export default router;