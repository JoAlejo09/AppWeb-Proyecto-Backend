import mongoose from 'mongoose';
const contenidoSchema = new mongoose.Schema({
  url: {
    Type:String,
    required: true,
  },
  tipo: { 
    type: String, 
    enum: ['video', 'articulo', 'guia'] 
},
  fuente: {
    type: String,
    trim: true
  }
});
