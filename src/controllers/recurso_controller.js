import Recurso from '../models/Recurso.js';
import Cuestionario from '../models/Cuestionario.js';
import Contenido from '../models/Contenido.js';    
import mongoose from 'mongoose'


const crearRecurso = async (req, res) => {
  try {
    const { tipo, titulo, descripcion, datos } = req.body;

    let ref, tipoRef;

    if (tipo === "cuestionario") {
      const nuevoCuestionario = new Cuestionario(datos);
      await nuevoCuestionario.save();
      ref = nuevoCuestionario._id;
      tipoRef = "Cuestionario"; // nombre exacto del modelo
    } else if (tipo === "contenido") {
      const nuevoContenido = new Contenido(datos);
      await nuevoContenido.save();
      ref = nuevoContenido._id;
      tipoRef = "Contenido"; // nombre exacto del modelo
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

// Obtener todos los recursos
const obtenerRecursos = async (req, res) => {
  try {
    const recursos = await Recurso.find()
      .populate("ref") // popula con cuestionario o contenido según tipo
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

    const recurso = await Recurso.findById(id).populate("ref");
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
      await Cuestionario.findByIdAndDelete(recurso.ref);
    } else if (recurso.tipo === "contenido") {
      await Contenido.findByIdAndDelete(recurso.ref);
    }

    await Recurso.findByIdAndDelete(id);

    res.status(200).json({ msg: "Recurso eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar recurso" });
  }
};

export{
  crearRecurso,
  obtenerRecursos,
  obtenerRecurso,
  actualizarRecurso,
  eliminarRecurso
};
