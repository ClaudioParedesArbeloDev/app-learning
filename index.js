//Modulos
import { config } from 'dotenv' //Archivo oculto que tiene datos sensibles
import mongoose from 'mongoose';
import app from './app.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server as SocketServer } from 'socket.io';
import http from 'http'

//Cargar las variable de entorno definidas en el archivo .env
config()

//Server de socket para crear un chat
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors:{origin:"http://localhost:3000", credentials: true
    
}})

// Definir un objeto para mapear los IDs de usuario a los IDs de socket
const userSocketMap = {};

// Cuando un usuario inicia sesión  
// Guardar el ID de socket del usuario en una estructura de datos
io.on('connection', (socket) => {
    socket.on('login', (userId) => {
        userSocketMap[userId] = socket.id;
        console.log('se conecto', userId)
        // Emitir evento para actualizar clientes sobre los usuarios conectados
       io.emit('userConnected', userId);
    });
    
    // Desconexión del usuario
    socket.on('disconnect', () => {
        // Eliminar el ID de socket del usuario de la estructura de datos
        const userId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        console.log(userId)
        // Eliminar la entrada correspondiente en userSocketMap
         if (userId) {
            delete userSocketMap[userId];
            console.log(`Usuario ${userId} se ha desconectado`);
            // Emitir evento para actualizar clientes sobre los usuarios desconectados
            io.emit('userDisconnected', userId);
            }
        });
    });

//Obtener la URI de la base de datos MongoDB desde las variables de entorno
const MONGODB_URI=process.env.MONGODB_URI

//Nombre DB
const dbName= 'registro2024';

//Definir el puerto del servidor
const port = process.env.PORT || 8080;

const SECRET = process.env.SECRET

// Configurar middleware de sesión
app.use(session({
    store: MongoStore.create({
            mongoUrl: MONGODB_URI,
            dbName,
            ttl: 15 // Tiempo de vida (en segundos) de la sesión
    }),
    secret: SECRET, // Clave secreta para firmar la sesión
    resave: true,
    saveUninitialized: true
}));


//Funcion para conectarse a la DB Mongodb
mongoose.connect(MONGODB_URI, { dbName })
    .then(() =>{
    console.log('¡Conexión a la base de datos exitosa!');
     // Iniciar el servidor después de que la conexión a la base de datos sea exitosa
    server.listen(port, () => {
        console.log('server is running on port', port);
    });
})  .catch (error => {
    console.error('No se pudo conectar a la base de datos:', error)
    });
