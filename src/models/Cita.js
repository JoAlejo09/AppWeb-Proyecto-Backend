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
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  motivo: {
    type: String,
    required: true
  },
  estadoPago: {
    type: String,
    enum: ['Pendiente', 'Pagado'],
    default: 'Pendiente'
  },
  metodoPago: {
    type: String, // Stripe / Efectivo / etc.
    default: 'Stripe'
  },
  emailPaciente: {
    type: String,
    required: true
  },
  nombrePaciente: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Cita = mongoose.model('Cita', citaSchema);
export default Cita;
