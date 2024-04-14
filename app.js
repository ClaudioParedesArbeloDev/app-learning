//Modulos
import express from 'express';
import cors from 'cors'; // Middleware para habilitar el intercambio de recursos entre diferentes orígenes (CORS)
import cookieParser from 'cookie-parser'; // Middleware para analizar cookies en las solicitudes HTTP
import usersRoute from './src/controllers/users.controllers.js'
import coursesRoute from './src/controllers/courses.controller.js'
import currentURL from './src/libs/currentURL.js';

// Creación de una instancia de la aplicación Express
const app = express();

// Configuración del puerto de la aplicación
app.set('port', process.env.PORT || 8080);

// Middleware para habilitar CORS
app.use(cors({
        origin:`${currentURL}`,  credentials: true
       
}));


// Middleware para analizar el cuerpo de las solicitudes entrantes como objetos JSON
app.use(express.json());

// Middleware para analizar las cookies en las solicitudes entrantes
app.use(cookieParser());

// Rutas Estaticas
app.use('/', express.static('./src/public'))
app.use('/', express.static('./public/img/documentacion'))
app.use('/', express.static('./img/documentacion'))

// Middleware para analizar los cuerpos de las solicitudes entrantes codificados en la URL
app.use(express.urlencoded({extended: true}))

// Rutas de la API para el manejo de usuarios, utilizando el enrutador userRouter
app.use('/api/', usersRoute)

// Rutas de la API para el manejo de cursos
app.use('/api/', coursesRoute)


export default app;