// src/models/Recurso.js
import mongoose from 'mongoose';

const recursoSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },

  // "tipo" lo puedes mantener en minúsculas para la UI
  tipo: { 
    type: String, 
    enum: ['cuestionario', 'contenido'], 
    required: true 
  },

  // <-- este apunta dinámicamente al nombre del modelo
  referencia: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'tipoRef'
  },

  // <-- debe contener el NOMBRE DEL MODELO
  tipoRef: { 
    type: String, 
    required: true, 
    enum: ['Cuestionario', 'Contenido']
  },

  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },
});

export default mongoose.model('Recurso', recursoSchema);
