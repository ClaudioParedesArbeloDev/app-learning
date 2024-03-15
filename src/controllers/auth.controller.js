//Modulos
import { createAccessToken } from '../libs/jwt.js'
import bcrypt from 'bcryptjs'
import registroModel from "../models/register.model.js";
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

// Cargar las variables de entorno
config()

// Obtener el secreto para firmar tokens JWT desde las variables de entorno
const TOKEN_SECRET = process.env.TOKEN_SECRET

// Controlador para iniciar sesión de usuario
export const login = async(req, res) =>{
    
    try {
    const { dni, password } = req.body;
    // Buscar al usuario por su DNI en la base de datos
    const userFound = await registroModel.findOne({dni});
    if (!userFound) return res.status(400).json({message: "usuario no registrado"});

    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({message: "contraseña incorrecta"});
    
    // Crear un token de acceso JWT para el usuario autenticado
    const token = await createAccessToken({ id:userFound._id});
    // Establecer el token como cookie en la respuesta
    res.cookie("token", token, {
        httpOnly: process.env.NODE_ENV !== "development",
        secure: true,
        sameSite: "none",
      });
    
    
}catch (error) {
     // Manejar cualquier error que pueda ocurrir durante el proceso de inicio de sesión
    res.status(500).json({message:"error.message"})
}
}

// Controlador para cerrar sesión de usuario
export const logout = (req, res) => {
    // Limpiar la cookie de token
    res.cookie('token', "", {
        expires: new Date(0)
    })
    // Devolver un código de estado 200 (OK)
    return res.sendStatus(200);
}

// Controlador para obtener el perfil de usuario
export const profile = async (req, res) => {
    // Buscar al usuario por su ID en la base de datos
    const userFound = await registroModel.findById(req.user.id)
    // Verificar si el usuario no fue encontrado
    if(!userFound) return res.status(400).json({message: "User not found"});
    // Devolver información básica del usuario en la respuesta
    return res.json({
        nombre: userFound.nombre,
        apellido: userFound.apellido

    })
}

// Controlador para verificar el token de acceso JWT
export const verifyToken = async (req, res) => {
    // Obtener el token de la cookie de la solicitud
    const {token} = req.cookies
    // Verificar si no se proporcionó ningún token
    if(!token) return res.status(401).json({message: "Unauthorized"});
    // Verificar la validez del token utilizando el secreto
    jwt.verify(token, TOKEN_SECRET, async (err, user) =>{
        // Manejar errores de verificación del token
        if(err) return res.status(401).json({message: "Unauthorized"});
        // Buscar al usuario en la base de datos utilizando el ID del token
        const userFound = await registroModel.findById(user.id)
            // Verificar si el usuario no fue encontrado
            if (!userFound) return res.status(401).json({message: "Unauthorized"});
        // Devolver información básica del usuario en la respuesta
        return res.json({
            id: userFound._id,
            nombre: userFound.nombre,
            apellido: userFound.apellido
        })
    })

}