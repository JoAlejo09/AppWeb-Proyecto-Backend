// controllers/citaController.js
import Cita from "../models/Cita.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);


const pagarCita = async (req, res) => {
  try {
    const { nombre, monto, descripcion } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: nombre,
              description: descripcion,
            },
            unit_amount: monto * 100, // dólares a centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/pago-exitoso`,
      cancel_url: `${process.env.FRONTEND_URL}/pago-cancelado`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error al crear sesión de pago' });
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

export {
  agendarCita,
  eliminarCita,
  pagarCita
};
