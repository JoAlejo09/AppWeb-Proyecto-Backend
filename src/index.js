import app from './server.js'
import connection from './database.js';
import cors from "cors";
import passport from 'passport'
import './config/passport.js'
import http from 'http';
import { Server } from 'socket.io';
import Mensaje from './models/Mensaje.js';
import jwt from 'jsonwebtoken';


app.use(cors({ origin: "*" })); // en producción debes especificar el dominio

app.use(passport.initialize());

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})

connection()

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"],
    }
})
io.on('connection', (socket) => {
    console.log('Usuario conectado',socket.id)
    socket.on('enviar-mensaje-front-back',(payload)=>{
        socket.broadcast.emit('enviar-mensaje-front-back',payload)
    })
})
io.listen((socket,next) => {
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
})
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('No autorizado'));
    }
    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        socket.usuario = usuario;
        next();  
    }   catch (error) {
        return next(new Error('Token inválido'));
    } 
});  
server.listen(app.get('port'), () => {
    console.log(`Socket.io server running on http://localhost:${app.get('port') + 1}`);
});