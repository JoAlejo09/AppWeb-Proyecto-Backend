// index.js
import app from './server.js';
import connection from './database.js';
import passport from 'passport';
import './config/passport.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Mensaje from './models/Mensaje.js'; // Modelo correcto

// Conectar a DB
connection();

// Inicializar Passport
app.use(passport.initialize());

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar socket.io con CORS seguro
const io = new Server(server, {
  cors: {
    origin: "https://app-web-proyecto-frontend.vercel.app", // producción
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware de autenticación por token JWT para socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Token no enviado'));
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    socket.usuario = usuario;
    next();
  } catch (err) {
    return next(new Error('Token inválido'));
  }
});

// Evento de conexión del cliente
io.on('connection', (socket) => {
  console.log('✅ Usuario conectado:', socket.usuario?.nombre || socket.id);

  socket.on('enviar-mensaje-front-back', async (payload) => {
    try {
      const nuevoMensaje = new Mensaje({
        emisor: socket.usuario.id,
        nombre: socket.usuario.nombre,
        mensaje: payload.body,
      });
      await nuevoMensaje.save();

      io.emit('enviar-mensaje-front-back', {
        from: socket.usuario.nombre,
        body: payload.body,
      });
    } catch (err) {
      console.error("❌ Error al guardar mensaje:", err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❎ Usuario desconectado:', socket.usuario?.nombre || socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || app.get('port') || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
