import mongoose from 'mongoose';

const respuestaCuestionarioSchema = new mongoose.Schema({
  cuestionario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cuestionario',
    required: true,
  },
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  respuestas: [
    {
      pregunta: {
        type: String,
        required: true,
      },
      respuesta: {
        type: mongoose.Schema.Types.Mixed, // texto o opción
        required: true,
      },
    },
  ],
  fecha: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('RespuestaCuestionario', respuestaCuestionarioSchema);
