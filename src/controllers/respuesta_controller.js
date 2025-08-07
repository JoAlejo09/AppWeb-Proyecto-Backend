import Respuesta from '../models/Respuesta.js';
import Cuestionario from '../models/Cuestionario.js';
import Recurso from '../models/Recurso.js';
import Reporte from '../models/Reporte.js';

const crearRespuestaCuestionario = async (req, res) => {
  try {
    const { cuestionarioId, respuestas } = req.body;
    const pacienteId = req.usuario._id; // asumimos que viene del token (middleware auth)

    // Validar que el cuestionario existe
    const cuestionario = await Cuestionario.findById(cuestionarioId);
    if (!cuestionario) {
      return res.status(404).json({ mensaje: 'Cuestionario no encontrado' });
    }

    // Guardar las respuestas
    const nuevaRespuesta = new RespuestaCuestionario({
      cuestionario: cuestionarioId,
      paciente: pacienteId,
      respuestas,
    });

    await nuevaRespuesta.save();

    // Buscar el recurso relacionado al cuestionario para registrar el uso
    const recurso = await Recurso.findOne({ referencia: cuestionarioId });
    if (recurso) {
      await Reporte.create({
        paciente: pacienteId,
        recurso: recurso._id,
        tipo: 'cuestionario',
        resultado: { completado: true },
      });
    }

    res.status(201).json({ mensaje: 'Respuestas guardadas correctamente', data: nuevaRespuesta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar respuestas' });
  }
};

const obtenerRespuestasPorPaciente = async (req, res) => {
  try {
    const pacienteId = req.params.pacienteId;

    const respuestas = await RespuestaCuestionario.find({ paciente: pacienteId })
      .populate('cuestionario')
      .sort({ fecha: -1 });

    res.json(respuestas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener respuestas' });
  }
};

const obtenerRespuestaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const respuesta = await RespuestaCuestionario.findById(id)
      .populate('cuestionario paciente');

    if (!respuesta) {
      return res.status(404).json({ mensaje: 'Respuesta no encontrada' });
    }

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la respuesta' });
  }
};

export{
    crearRespuestaCuestionario,
    obtenerRespuestasPorPaciente,
    obtenerRespuestaPorId
}