import mongoose from 'mongoose';

const citaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    // si todavía no asignas un profesional, puedes hacerlo opcional
    required: false
  },
  fecha: {
    type: Date,
    required: true
  },
  motivo: {
    type: String,
    required: true,
    trim: true
  },
  // Estado de la cita (no de pago)
  estadoCita: {
    type: String,
    enum: ['Programada', 'Cumplida', 'Cancelada'],
    default: 'Programada'
  },
  // Pago
  estadoPago: {
    type: String,
    enum: ['Pendiente', 'Pagado'],
    default: 'Pendiente'
  },
  metodoPago: {
    type: String, // 'Stripe' | 'Efectivo'
    required: true,
    default: 'Stripe'
  },
  monto: {
    type: Number, // en centavos o dólares (define una convención: aquí usaremos USD enteros)
    required: true
  },
  // Datos Stripe
  paymentIntentId: { type: String },
  chargeId: { type: String },

  // Info de paciente cacheada (para reportes rápidos)
  emailPaciente: { type: String, required: true },
  nombrePaciente: { type: String, required: true },

}, { timestamps: true });

export default mongoose.model('Cita', citaSchema);
