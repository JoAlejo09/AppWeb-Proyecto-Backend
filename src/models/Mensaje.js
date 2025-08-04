import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  remitente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Mensaje', mensajeSchema);
