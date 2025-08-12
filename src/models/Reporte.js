import mongoose from 'mongoose';

const reporteSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  recurso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recurso',
    required: true,
  },
  tipo: {
    type: String,
    enum: ['cuestionario', 'contenido'],
    required: true,
  },
  resultado: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Reporte', reporteSchema);
