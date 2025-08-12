import Recurso from '../models/Recurso.js';
import Cuestionario from '../models/Cuestionario.js';
import Contenido from '../models/Contenido.js';    
import mongoose from 'mongoose'
import Reporte from '../models/Reporte.js';
import RespuestaCuestionario from '../models/RespuestaCuestionario.js';

// Crear recurso
const crearRecurso = async (req, res) => {
  try {
    const { tipo, titulo, descripcion, datos } = req.body;

    let referencia, tipoRef;

    if (tipo === "cuestionario") {
      const nuevoCuestionario = new Cuestionario(datos);
      await nuevoCuestionario.save();
      referencia = nuevoCuestionario._id;
      tipoRef = "cuestionario";
    } else if (tipo === "contenido") {
      const nuevoContenido = new Contenido(datos);
      await nuevoContenido.save();
      referencia = nuevoContenido._id;
      tipoRef = "contenido";
    } else {
      return res.status(400).json({ msg: "Tipo de recurso inválido" });
    }

    const nuevoRecurso = new Recurso({
      titulo,
      descripcion,
      tipo,
      referencia,
      tipoRef
    });

    await nuevoRecurso.save();
    res.status(201).json({ msg: "Recurso creado correctamente", recurso: nuevoRecurso });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el recurso" });
  }
};

const obtenerRecursos = async (req, res) => {
  try {
    const recursos = await Recurso.find()
      .populate("referencia") // ahora sí existe
      .lean();

    res.status(200).json(recursos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener recursos" });
  }
};

const obtenerRecurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const recurso = await Recurso.findById(id).populate("referencia");
    if (!recurso) {
      return res.status(404).json({ msg: "Recurso no encontrado" });
    }

    res.status(200).json(recurso);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el recurso" });
  }
};

const actualizarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, datos } = req.body;

    const recurso = await Recurso.findById(id);
    if (!recurso) {
      return res.status(404).json({ msg: "Recurso no encontrado" });
    }

    recurso.titulo = titulo || recurso.titulo;
    recurso.descripcion = descripcion || recurso.descripcion;

    if (recurso.tipo === "cuestionario") {
      await Cuestionario.findByIdAndUpdate(recurso.referencia, datos);
    } else if (recurso.tipo === "contenido") {
      await Contenido.findByIdAndUpdate(recurso.referencia, datos);
    }

    await recurso.save();
    res.status(200).json({ msg: "Recurso actualizado correctamente", recurso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar recurso" });
  }
};

const eliminarRecurso = async (req, res) => {
  try {
    const { id } = req.params;

    const recurso = await Recurso.findById(id);
    if (!recurso) {
      return res.status(404).json({ msg: "Recurso no encontrado" });
    }

    if (recurso.tipo === "cuestionario") {
      await Cuestionario.findByIdAndDelete(recurso.referencia);
    } else if (recurso.tipo === "contenido") {
      await Contenido.findByIdAndDelete(recurso.referencia);
    }

    await Recurso.findByIdAndDelete(id);
    res.status(200).json({ msg: "Recurso eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar recurso" });
  }
};


const utilizarRecurso = async (req, res) => {
  try {
    const pacienteId = req.usuario._id; // viene del JWT
    const { recursoId, tipo, respuestas } = req.body;

    const recurso = await Recurso.findById(recursoId);
    if (!recurso || !recurso.activo) {
      return res.status(404).json({ msg: "Recurso no disponible" });
    }

    if (tipo === 'contenido') {
      // 1) Solo registro de visto en Reporte
      const reporte = await Reporte.create({
        paciente: pacienteId,
        recurso: recursoId,
        tipo: 'contenido',
        resultado: { visto: true }
      });
      return res.status(201).json({ msg: 'Contenido marcado como visto', reporte });
    }

    if (tipo === 'cuestionario') {
      // 2) Validar cuestionario y guardar respuestas detalladas
      if (recurso.tipo !== 'cuestionario') {
        return res.status(400).json({ msg: 'El recurso no es cuestionario' });
      }

      const cuestionario = await Cuestionario.findById(recurso.referencia);
      if (!cuestionario) {
        return res.status(404).json({ msg: 'Cuestionario no encontrado' });
      }

      // Guardar respuestas en su colección
      const docRespuesta = await RespuestaCuestionario.create({
        paciente: pacienteId,
        recurso: recursoId,
        cuestionario: cuestionario._id,
        respuestas: respuestas || []
      });

      // Y crear un Reporte resumen con link a la respuesta detallada
      const reporte = await Reporte.create({
        paciente: pacienteId,
        recurso: recursoId,
        tipo: 'cuestionario',
        resultado: {
          respuestaId: docRespuesta._id,
          totalPreguntas: cuestionario.preguntas.length,
          respondidas: (respuestas || []).length
        }
      });

      return res.status(201).json({ msg: 'Cuestionario respondido', reporte, respuesta: docRespuesta });
    }

    return res.status(400).json({ msg: 'Tipo inválido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al utilizar el recurso" });
  }
};


export{
  crearRecurso,
  obtenerRecursos,
  obtenerRecurso,
  actualizarRecurso,
  eliminarRecurso,
  utilizarRecurso
};
