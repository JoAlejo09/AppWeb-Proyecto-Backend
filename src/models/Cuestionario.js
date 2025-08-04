import mongoose from 'mongoose';

const cuestionarioSchema = new mongoose.Schema({
  preguntas: [
    {
      texto: {
        type: String,
        required: true,
        trim: true
      },
      opciones: [String],
      
      tipoRespuesta: { type: String, enum: ['opcion', 'abierta'] }
    }
  ]
});
export default mongoose.model('Cuestionario', cuestionarioSchema);
