import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"

import routerAdministrador from './routers/administrador_routes.js'
import routerUsuario from './routers/usuario_routes.js'
import routerPaciente from './routers/paciente_routes.js'
import routerAutenticacion from './routers/autenticacion_routes.js'


const app = express()

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))
app.set('port',process.env.PORT || 3000)
app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Server on")
})

app.use('/admin',routerAdministrador)
app.use('/usuarios',routerUsuario)
app.use ('/pacientes', routerPaciente)
app.use('/auth', routerAutenticacion)


app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app