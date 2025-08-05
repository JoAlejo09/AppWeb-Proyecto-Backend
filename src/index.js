import app from './server.js'
import connection from './database.js';
import cors from "cors";
import passport from 'passport'
import './config/passport.js'
import http from 'http';
import { Server } from 'socket.io';


app.use(cors({ origin: "https://app-web-proyecto-frontend.vercel.app" })); 

app.use(passport.initialize());
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: "https://app-web-proyecto-frontend.vercel.app",
    methods: ["GET", "POST"]
  }
})
io.on('connection', (socket) => {
    console.log('Usuario conectado', socket.id)
    socket.on('enviar-mensaje-front-back', (payload) => {
        // Envía el mensaje a todos menos al emisor
        socket.broadcast.emit('enviar-mensaje-front-back', payload)
    })
})
app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})

connection()