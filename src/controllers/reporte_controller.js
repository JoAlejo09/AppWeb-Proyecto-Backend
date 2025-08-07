import Reporte from '../models/Reporte.js';
import Recurso from '../models/Recurso.js';
import Usuario from '../models/Usuario.js';

const crearReporte = async (req, res) => {
  try {
    const { pacienteId, recursoId, resultado } = req.body;

    const recurso = await Recurso.findById(recursoId);
    if (!recurso) return res.status(404).json({ msg: 'Recurso no encontrado' });

    const nuevoReporte = await Reporte.create({
      paciente: pacienteId,
      recurso: recursoId,
      tipo: recurso.tipo,
      resultado,
    });

    res.status(201).json(nuevoReporte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear reporte' });
  }
};

const obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.find()
      .populate('paciente', 'nombre correo') // o campos que te interesen
      .populate('recurso', 'titulo tipo')
      .lean();
    res.status(200).json(reportes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener reportes' });
  }
};

const obtenerReportePorId = async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id)
      .populate('paciente', 'nombre correo')
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
      .populate('recurso') // opcional
      .sort({ fecha: -1 }); // más recientes primero

    res.json(reportes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener tus reportes' });
  }
};

export{
    crearReporte,
    obtenerReportes,
    obtenerReportePorId,
    obtenerReportesPorPaciente,
    eliminarReporte, 
    obtenerMisReportes
}