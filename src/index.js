import app from './server.js';
import connection from './database.js';
import cors from "cors";
import passport from 'passport';
import './config/passport.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Mensaje from './models/Mensaje.js';

// Middleware
app.use(cors({ origin: "*" })); // Cambia "*" por tu frontend en producción
app.use(passport.initialize());

// CONECTAR A DB
connection();

// CREA SERVIDOR HTTP A PARTIR DE EXPRESS
const server = http.createServer(app);

// INICIA SOCKET.IO SOBRE HTTP SERVER
const io = new Server(server, {
  cors: {
    origin: "https://app-web-proyecto-frontend.vercel.app", // ajusta a tu dominio real
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// MIDDLEWARE SOCKET.IO JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('No autorizado'));
  }
  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    socket.usuario = usuario; // ahora puedes acceder a socket.usuario
    next();
  } catch (error) {
    return next(new Error('Token inválido'));
  }
});

// CONEXIÓN SOCKET
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.usuario?.nombre || socket.id);
  io.emit('enviar-mensaje-front-back', payload);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.usuario?.nombre || socket.id);
  });
});

// LEVANTA EL SERVIDOR COMPLETO (HTTP + EXPRESS + SOCKET.IO)
const PORT = app.get('port') || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
