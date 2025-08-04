import app from './server.js';
import connection from './database.js';
import cors from "cors";
import passport from 'passport';
import './config/passport.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Mensaje from './models/Mensaje.js'; // Asegúrate de que este modelo esté bien definido

// Middleware
app.use(cors({ origin: "*" })); // Cambia "*" por tu frontend en producción
app.use(passport.initialize());

// Conectar a DB
connection();

// Crear servidor HTTP
const server = http.createServer(app);

// Iniciar Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://app-web-proyecto-frontend.vercel.app", // o http://localhost:5173 para pruebas locales
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Middleware de autenticación con JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('No autorizado'));
  }
  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    socket.usuario = usuario;
    next();
  } catch (error) {
    return next(new Error('Token inválido'));
  }
});

// Conexión de cliente
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.usuario?.nombre || socket.id);

  // Escuchar mensajes del cliente
  socket.on('enviar-mensaje-front-back', async (payload) => {
    // Guardar el mensaje en la base de datos si deseas
    try {
      const nuevoMensaje = new Mensaje({
        emisor: socket.usuario._id, // Asegúrate que el token contiene _id
        nombre: socket.usuario.nombre,
        mensaje: payload.body,
      });
      await nuevoMensaje.save();
    } catch (error) {
      console.error("Error guardando mensaje:", error.message);
    }

    // Enviar mensaje a todos los clientes
    io.emit('enviar-mensaje-front-back', {
      from: socket.usuario.nombre,
      body: payload.body
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.usuario?.nombre || socket.id);
  });
});

// Iniciar servidor
const PORT = app.get('port') || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
