//Modulos
import { config } from 'dotenv';
import jwt from 'jsonwebtoken'

// Cargar las variables de entorno
config()

// Obtener el secreto para firmar tokens JWT desde las variables de entorno
const TOKEN_SECRET = process.env.TOKEN_SECRET

// Función para crear un token de acceso JWT
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
     // Firmar el token JWT con el payload y el secreto
    jwt.sign(
        payload,// Datos que se incluirán en el token (payload)
        TOKEN_SECRET,
        {expiresIn: "1d",},// Opciones del token (caducidad: 1 día)
        (err, token) => {
            // Manejar errores de firma del token
            if(err) reject(err)
             // Resolver la promesa con el token generado
            resolve(token)
        }
    );
    });
}