import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerAdministrador from './routers/administrador_routes.js'
import routerUsuario from './routers/usuario_routes.js'
import serverless from 'serverless-http';

const app = express()
dotenv.config()

/*app.use(cors({
  origin: process.env.URL_FRONTEND || '*',
  credentials: true
}));
*/
app.set('port',process.env.port || 3000)
app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Server on")
})

app.use('/admin',routerAdministrador)
app.use('',routerUsuario)

//app.use('/paciente',routerPaciente)

app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app