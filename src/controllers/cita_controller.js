// controllers/cita_controller.js
import Cita from "../models/Cita.js";
import Stripe from 'stripe';
import dayjs from 'dayjs'; // npm i dayjs (opcional pero útil)
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

// Agendar y pagar (Stripe / CardElement)
export const agendarCitaYpagar = async (req, res) => {
  try {
    const { fecha, hora, motivo, duracion, paymentMethodId } = req.body;

    if (!fecha || !hora || !motivo || !duracion || !paymentMethodId) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    // 1) Obtener del token JWT (middleware verificarTokenJWT debe setear req.usuario)
    const paciente = req.usuario; // { _id, nombre, email, ... }

    // 2) Convertir a Date (usa dayjs o manual)
    const fechaHora = dayjs(`${fecha} ${hora}`).toDate();

    // 3) Monto (USD enteros)
    const monto = duracion === 60 ? 35 : 20;

    // 4) Crear cita en BD (Pendiente)
    const nuevaCita = await Cita.create({
      paciente: paciente._id,
      profesional: null, // por ahora o pon un ID si tienes uno
      fecha: fechaHora,
      motivo,
      estadoCita: 'Programada',
      estadoPago: 'Pendiente',
      metodoPago: 'Stripe',
      monto,
      emailPaciente: paciente.email,
      nombrePaciente: paciente.nombre,
    });

    // 5) Crear PaymentIntent y confirmar
    const payment = await stripe.paymentIntents.create({
      amount: monto * 100,        // a centavos
      currency: "usd",
      description: `Cita - ${motivo}`,
      payment_method: paymentMethodId,
      confirm: true,              // confirmación inmediata
      automatic_payment_methods: { enabled: true }
    });

    // 6) Actualizar cita según resultado
    if (payment.status === "succeeded") {
      nuevaCita.estadoPago = "Pagado";
      nuevaCita.paymentIntentId = payment.id;
      await nuevaCita.save();
      return res.status(201).json({
        msg: "Cita agendada y pagada correctamente",
        cita: nuevaCita
      });
    } else {
      // 3DS u otros estados: puedes manejar next actions
      return res.status(202).json({
        msg: "Se requiere acción adicional",
        paymentIntent: payment
      });
    }

  } catch (error) {
    console.error("Error agendar y pagar:", error);
    return res.status(500).json({ msg: "Error al agendar y pagar cita" });
  }
};
// Agendar con efectivo (sin Stripe)
export const agendarCitaEfectivo = async (req, res) => {
  try {
    const { fecha, hora, motivo, duracion } = req.body;
    if (!fecha || !hora || !motivo || !duracion) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    const paciente = req.usuario;
    const fechaHora = dayjs(`${fecha} ${hora}`).toDate();
    const monto = duracion === 60 ? 35 : 20;

    const nuevaCita = await Cita.create({
      paciente: paciente._id,
      profesional: null,
      fecha: fechaHora,
      motivo,
      estadoCita: 'Programada',
      estadoPago: 'Pendiente',
      metodoPago: 'Efectivo',
      monto,
      emailPaciente: paciente.email,
      nombrePaciente: paciente.nombre,
    });

    return res.status(201).json({
      msg: "Cita agendada (pago en efectivo pendiente)",
      cita: nuevaCita
    });

  } catch (error) {
    console.error("Error agendar efectivo:", error);
    return res.status(500).json({ msg: "Error al agendar cita en efectivo" });
  }
};
export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findById(id);
    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    // Opcional: validar si el que elimina es el mismo paciente o si es admin
    await cita.deleteOne();
    res.json({ msg: "Cita eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar cita" });
  }
};
// Listar todas las citas (Admin)
export const listarCitas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('paciente', 'nombre email')
      .populate('profesional', 'nombre email')
      .sort({ createdAt: -1 });

    res.json(citas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar citas" });
  }
};

// Marcar cita como Cumplida (Admin)
export const marcarCumplida = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findById(id);
    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    cita.estadoCita = 'Cumplida';
    await cita.save();

    res.json({ msg: "Cita marcada como cumplida", cita });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar estado de cita" });
  }
};

// Marcar pagada (Efectivo) (Admin)
export const marcarPagadaEfectivo = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findById(id);
    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    if (cita.metodoPago !== 'Efectivo') {
      return res.status(400).json({ msg: "Solo puede marcar pagadas las citas con método 'Efectivo'" });
    }

    cita.estadoPago = 'Pagado';
    await cita.save();

    res.json({ msg: "Cita marcada como pagada (efectivo)", cita });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar estado de pago" });
  }
};

// Mis citas (Paciente)
export const misCitas = async (req, res) => {
  try {
    const pacienteId = req.usuario._id;
    const citas = await Cita.find({ paciente: pacienteId }).sort({ fecha: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tus citas" });
  }
};
