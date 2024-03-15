//Modulos
import { config } from 'dotenv' //Archivo oculto que tiene datos sensibles
import mongoose from 'mongoose';
import app from './app.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';

//Cargar las variable de entorno definidas en el archivo .env
config()

//Obtener la URI de la base de datos MongoDB desde las variables de entorno
const MONGODB_URI=process.env.MONGODB_URI

//Nombre DB
const dbName= 'registro2024';

//Definir el puerto del servidor
const port = process.env.PORT || 8000;

const SECRET = process.env.SECRET

// Configurar middleware de sesión
app.use(session({
    store: MongoStore.create({
            mongoUrl: MONGODB_URI,
            dbName,
            mongoOptions:{
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
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
    app.listen(port, () => {
        console.log('server is running on port', port);
    });
})  .catch (error => {
    console.error('No se pudo conectar a la base de datos:', error)
    });
