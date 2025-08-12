import Reporte from '../models/Reporte.js';
import Recurso from '../models/Recurso.js';
import Usuario from '../models/Usuario.js';
import mongoose from 'mongoose';

const crearReporte = async (req, res) => {
  try {
    const { pacienteId, recursoId, resultado } = req.body;

    const recurso = await Recurso.findById(recursoId);
    if (!recurso) return res.status(404).json({ msg: 'Recurso no encontrado' });

    const nuevoReporte = await Reporte.create({
      paciente: pacienteId,
      recurso: recursoId,
      tipo: recurso.tipo, // 'cuestionario' | 'contenido'
      resultado,          // Mixed: {visto:true, fecha:...} o {respuestas:[...]}
    });

    res.status(201).json(nuevoReporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear reporte' });
  }
};

const obtenerReportes = async (req, res) => {
  try {
    const { search = "", pacienteId, page = 1, limit = 20 } = req.query;
    const filter = {};
    const options = {
      sort: { fecha: -1 },
      limit: Math.max(parseInt(limit), 1),
      skip: (Math.max(parseInt(page), 1) - 1) * Math.max(parseInt(limit), 1),
    };

    if (pacienteId && mongoose.Types.ObjectId.isValid(pacienteId)) {
      filter.paciente = pacienteId;
    } else if (search.trim()) {
      // Buscar pacientes por nombre/correo con regex
      const regex = new RegExp(search.trim(), 'i');
      const pacientes = await Usuario.find(
        {
          rol: 'paciente',
          $or: [{ nombre: regex }, { email: regex }]
        },
        { _id: 1 }
      );
      filter.paciente = { $in: pacientes.map(p => p._id) || [] };
    }

    const [items, total] = await Promise.all([
      Reporte.find(filter, null, options)
        .populate('paciente', 'nombre email')
        .populate('recurso', 'titulo tipo')
        .lean(),
      Reporte.countDocuments(filter),
    ]);

    res.status(200).json({
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener reportes' });
  }
};

const obtenerReportePorId = async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id)
      .populate('paciente', 'nombre email')
      .populate('recurso', 'titulo tipo')
      .lean();
    if (!reporte) return res.status(404).json({ msg: 'Reporte no encontrado' });
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el reporte' });
  }
};

const obtenerReportesPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const reportes = await Reporte.find({ paciente: pacienteId })
      .populate('recurso', 'titulo tipo')
      .sort({ fecha: -1 })
      .lean();
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener reportes del paciente' });
  }
};

const eliminarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Reporte.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ msg: 'Reporte no encontrado' });
    res.json({ msg: 'Reporte eliminado' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar reporte' });
  }
};

const obtenerMisReportes = async (req, res) => {
  try {
    const pacienteId = req.usuario.id;
    const reportes = await Reporte.find({ paciente: pacienteId })
      .populate('recurso', 'titulo tipo') // si quieres
      .sort({ fecha: -1 });
    res.json(reportes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener tus reportes' });
  }
};

export {
  crearReporte,
  obtenerReportes,
  obtenerReportePorId,
  obtenerReportesPorPaciente,
  eliminarReporte,
  obtenerMisReportes
};
