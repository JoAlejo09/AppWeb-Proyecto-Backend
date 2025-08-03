import express from 'express';
import {confirmarCuentaPaciente} from '../controllers/paciente_controller.js'

const router = express.Router();
router.get('/confirmar/:token',confirmarCuentaPaciente)

export default router;