import mongoose from 'mongoose';

const recursoSchema = new mongoose.Schema({
  titulo:{
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  tipo: { 
    type: String, 
    enum: ['cuestionario', 'contenido'], 
    required: true 
    },
  referencia: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'tipoRef' },
    tipoRef: { 
        type: String, 
        required: true, 
        enum: ['cuestionario', 'contenido'] },
 creadoPor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
  activo: { 
    type: Boolean, 
    default: true },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  },
});
export default mongoose.model('Recurso', recursoSchema);
