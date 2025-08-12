import Recurso from '../models/Recurso.js';
import Cuestionario from '../models/Cuestionario.js';
import Contenido from '../models/Contenido.js';    
import mongoose from 'mongoose'
import Reporte from '../models/Reporte.js';

const crearRecurso = async (req, res) => {
  try {
    const { tipo, titulo, descripcion, datos } = req.body;

    let ref, tipoRef;

    if (tipo === "cuestionario") {
      const nuevoCuestionario = new Cuestionario(datos);
      await nuevoCuestionario.save();
      ref = nuevoCuestionario._id;
      tipoRef = "cuestionario"; // nombre exacto del modelo
    } else if (tipo === "contenido") {
      const nuevoContenido = new Contenido(datos);
      await nuevoContenido.save();
      ref = nuevoContenido._id;
      tipoRef = "contenido"; // nombre exacto del modelo
    } else {
      return res.status(400).json({ msg: "Tipo de recurso inválido" });
    }

    const nuevoRecurso = new Recurso({
      titulo,
      descripcion,
      tipo,
      ref,
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
      .populate("referencia") // popula con cuestionario o contenido según tipo
      .lean();

    res.status(200).json(recursos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener recursos" });
  }
};

// Obtener un recurso por ID
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
    res.status(500).json({ msg: "Error al obtsener el recurso" });
  }
};

// Actualizar recurso
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
      await Cuestionario.findByIdAndUpdate(recurso.ref, datos);
    } else if (recurso.tipo === "contenido") {
      await Contenido.findByIdAndUpdate(recurso.ref, datos);
    }

    await recurso.save();
    res.status(200).json({ msg: "Recurso actualizado correctamente", recurso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar recurso" });
  }
};

// Eliminar recurso
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
    const recursoId = req.params.id;
    const { resultado } = req.body;
    const pacienteId = req.usuario.id;

    const recurso = await Recurso.findById(recursoId);
    if (!recurso || !recurso.activo) {
      return res.status(404).json({ msg: 'Recurso no encontrado o inactivo' });
    }

    // Validaciones según tipo de recurso
    if (recurso.tipo === 'contenido') {
      if (!resultado || !resultado.visto) {
        return res.status(400).json({ msg: 'Se espera un resultado con { visto: true } para contenido' });
      }
    }

    if (recurso.tipo === 'cuestionario') {
      if (!resultado || !Array.isArray(resultado.respuestas)) {
        return res.status(400).json({ msg: 'Se esperan respuestas en un array para cuestionario' });
      }
    }

    // Crear el reporte
    const nuevoReporte = new Reporte({
      paciente: pacienteId,
      recurso: recurso._id,
      tipo: recurso.tipo,
      resultado,
    });

    await nuevoReporte.save();

    res.status(201).json({
      msg: 'Uso del recurso registrado correctamente',
      reporte: nuevoReporte,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al utilizar el recurso' });
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
