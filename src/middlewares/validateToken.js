//Modulos
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Cargar las variables de entorno
config()

// Obtener el secreto para verificar los tokens JWT desde las variables de entorno
const TOKEN_SECRET = process.env.TOKEN_SECRET

// Middleware para verificar la autenticación del usuario
export const authRequired = (req, res, next) =>{
    // Obtener el token de la cookie de la solicitud
    const { token } = req.cookies;
    // Verificar si no se proporcionó ningún token
    if(!token)
    // Si no se proporcionó ningún token, devolver un error de autorización
    return res.status(401).json({message: "No token, Autorizacion denegada"})
    // Verificar la validez del token utilizando el secreto
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        // Manejar errores de verificación del token
        if(err) 
        // Si el token es inválido, devolver un error de autorización
        return res.status(403).json({message: "Invalid token"})
        // Si el token es válido, agregar el usuario decodificado al objeto de solicitud (req)
        req.user = user
    // Llamar a la función 'next' para pasar al siguiente middleware o controlador
    next();
    })
}