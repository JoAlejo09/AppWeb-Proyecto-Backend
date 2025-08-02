import app from './server.js'
import connection from './database.js';
import cors from "cors";
import passport from 'passport'
import {GoogleStrategy} './config/passport.js'

app.use(cors({ origin: "*" })); // en producción debes especificar el dominio

app.use(passport.initialize());

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})

connection()
