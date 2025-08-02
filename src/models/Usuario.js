import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  telefono: {
    type: String,
    default: ''
  },
  rol:{
    type: String,
    enum: ['admin','paciente'],
    default: 'paciente'
  },
  token: {
    type: String,
    default: null
  },
  confirmEmail: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    default: true
  },
  imagen:{
    type: String,
    trim: true
  },
  imagenID:{
    type:String,
    trim: true
  },
  imagenIA:{
    type:String,
    trim:true
  }
}, {
  timestamps: true
})

// Método para cifrar el password del veterinario
usuarioSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}


// Método para verificar si el password ingresado es el mismo de la BDD
usuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}


// Método para crear un token 
usuarioSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}
export default model('Usuario', usuarioSchema);
