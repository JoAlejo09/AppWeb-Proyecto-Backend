// src/models/RespuestaCuestionario.js
import mongoose from 'mongoose';

const respuestaCuestionarioSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  recurso: { type: mongoose.Schema.Types.ObjectId, ref: 'Recurso', required: true },
  cuestionario: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuestionario', required: true },
  respuestas: [
    {
      preguntaId: { type: mongoose.Schema.Types.ObjectId, required: true },
      respuesta: { type: String, required: true }, // texto u opción seleccionada
    }
  ],
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model('RespuestaCuestionario', respuestaCuestionarioSchema);
