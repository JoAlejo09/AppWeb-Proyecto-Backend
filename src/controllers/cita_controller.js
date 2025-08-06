// controllers/citaController.js
import Cita from "../models/Cita.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const agendarCita = async (req, res) => {
  const { paciente, profesional, fecha, motivo, emailPaciente, nombrePaciente, monto } = req.body;

  try {
    const nuevaCita = new Cita({
      paciente,
      profesional,
      fecha,
      motivo,
      emailPaciente,
      nombrePaciente,
      monto
    });

    const citaGuardada = await nuevaCita.save();
    res.status(201).json(citaGuardada);
  } catch (error) {
    res.status(500).json({ msg: "Error al agendar cita", error });
  }
};

const eliminarCita = async (req, res) => {
  const { id } = req.params;

  try {
    const cita = await Cita.findById(id);
    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

    await cita.deleteOne();
    res.json({ msg: "Cita eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar cita", error });
  }
};

const pagarCita = async (req, res) => {
  const { paymentMethodId, citaId } = req.body;

  try {
    const cita = await Cita.findById(citaId).populate('paciente');
    if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });
    if (cita.estadoPago === "Pagado") return res.status(400).json({ msg: "La cita ya fue pagada" });

    if (!paymentMethodId) return res.status(400).json({ msg: "paymentMethodId no proporcionado" });

    let [cliente] = (await stripe.customers.list({
      email: cita.emailPaciente,
      limit: 1
    })).data || [];

    if (!cliente) {
      cliente = await stripe.customers.create({
        name: cita.nombrePaciente,
        email: cita.emailPaciente
      });
    }

    const payment = await stripe.paymentIntents.create({
      amount: cita.monto,
      currency: "USD",
      description: `Pago de cita: ${cita.motivo}`,
      payment_method: paymentMethodId,
      confirm: true,
      customer: cliente.id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      }
    });

    if (payment.status === "succeeded") {
      await Cita.findByIdAndUpdate(citaId, { estadoPago: "Pagado" });
      return res.status(200).json({ msg: "Pago exitoso de la cita" });
    }

    res.status(400).json({ msg: "No se completó el pago" });
  } catch (error) {
    res.status(500).json({ msg: "Error al pagar cita", error: error.message });
  }
};

export {
  agendarCita,
  eliminarCita,
  pagarCita
};
