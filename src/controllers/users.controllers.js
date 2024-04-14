//Modulos
import express from 'express';
import multer from "multer";
import bcrypt from 'bcryptjs'
import sharp from 'sharp';
import {mkdir, existsSync} from 'fs'
import registroModel from "../models/register.model.js";
import mensajeModel from '../models/chat.model.js';
import { createAccessToken } from '../libs/jwt.js';
import { authRequired } from '../middlewares/validateToken.js';
import { verifyToken } from './auth.controller.js';
import sendMail from './mail.controller.js';
import { config } from 'dotenv';
import crypto from 'crypto'
import URL from '../libs/currentURL.js';



// Crear un enrutador de Express
const router=express.Router();

config()



// Configurar el almacenamiento para multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let dni;
    
    // Obtener el número de DNI según el tipo de solicitud
    if (req.method === 'POST' && req.body && req.body.dni) {
      dni = req.body.dni;
    } else if (req.method === 'PUT' && req.params && req.params.dni) {
      dni = req.params.dni;
    } else {
      return cb(new Error('No se proporcionó el número de DNI en la solicitud'), null);
    }
    // Crear una carpeta por cada usuario utilizando el DNI como nombre de la carpeta
    const dniFolder = `public/img/documentacion/${dni}/`; 
    // Comprobar si la carpeta del usuario ya existe
    if (!existsSync(dniFolder)) { // Utilizar existsSync para comprobar si la carpeta existe
      // Si no existe, crear la carpeta
      mkdir(dniFolder, { recursive: true }, (err) => { // Utilizar mkdir para crear la carpeta de forma asíncrona
        if (err) {
          console.error('Error al crear la carpeta:', err);
          cb(err, null);
        } else {
          cb(null, dniFolder);
        }
      });
    } else {
      cb(null, dniFolder);
    }
  },
  
  // Función para generar el nombre de archivo
  filename: function(req, file, cb) {
    const fileType = file.fieldname;
    const extension = getFileExtension(file.originalname);

    const filename = `${fileType}.${extension}`
    cb(null, filename);
  }
});

// Función para obtener la extensión de un archivo
function getFileExtension(filename) {
  return filename.split('.').pop();
}

// Configurar multer con el almacenamiento y límites definidos
const uploader = multer({
  storage: storage,
  limits: {
      fileSize: 2 * 1024 * 1024 // Tamaño máximo del archivo: 2MB
  }
})

// Middleware para procesar la carga de imágenes
const processImageUpload = async (req, res, next) => {
  // Verificar si se proporcionaron imágenes de frente y dorso
  if (req.files && req.files['frente'] && req.files['dorso'] && req.files['avatar']) {
    try {
      // Procesar y guardar la imagen de frente
      const frenteBuffer = req.files['frente'][0].buffer;
      await sharp(frenteBuffer)
        .resize({ width: 500, height: 500 })
        .toFile(`/${req.body.dni}/frente.jpg`);

      // Procesar y guardar la imagen de dorso
      const dorsoBuffer = req.files['dorso'][0].buffer;
      await sharp(dorsoBuffer)
        .resize({ width: 500, height: 500 })
        .toFile(`/${req.body.dni}/dorso.jpg`);

      // Procesar y guardar la imagen de avatar
        const avatarBuffer = req.files['avatar'][0].buffer;
        await sharp(avatarBuffer)
          .resize({ width: 500, height: 500 })
          .toFile(`/${req.body.dni}/avatar.jpg`);

        
      // Continuar con el siguiente middleware/ruta
      next();
    } catch (error) {
      console.error('Error al procesar las imágenes:', error);
      res.status(500).json({ message: 'Error interno del servidor al procesar las imágenes' });
    }
  } else {
    // Si no se proporcionaron imágenes, continuar con el siguiente middleware/ruta
    next();
  }
};


// Ruta para obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
      const users = await registroModel.find();

      // Enviar una respuesta con estado 200 y los resultados paginados
      res.status(200).json(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// Ruta para obtener un usuario por su DNI  
router.get('/users/:dni', async(req, res) =>{
    try {
      const dni = req.params.dni
      const alumno = await registroModel.findOne({dni})
        .populate('courses.course')
      console.log(alumno)

      res.status(200).json(alumno)
    } catch (error){
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ message: "Internal server error" });
    }
})

// Ruta para obtener un usuario por ID
router.get('/login/:id', async(req, res) =>{
  try {
    const _id = req.params.id
    const alumno = await registroModel.findById({_id})
    console.log(alumno)
    if(!alumno.avatar){
      alumno.avatar = '/img/avatar.png';
    }
    res.status(200).json(alumno)
  } catch (error){
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

// Ruta para eliminar un usuario por su DNI
router.get('/users/delete/:dni', async(req, res) => {
  try{
    const {dni} = req.params
    await registroModel.deleteOne({dni})
    res.status(200).json({message: 'El alumno ha sido eliminado'}) 
    }catch (error) {
      res.status(500).json({message: 'Error al eliminar alumno'})
    }
})

// Ruta para actualizar un usuario por su DNI
router.put('/users/:dni', uploader.fields(
  [{ name: 'avatar', maxCount: 1 }, 
   { name: 'frente', maxCount: 1 }, 
   { name: 'dorso', maxCount: 1 }]), 
   processImageUpload, async (req, res) => {
    const {dni} = req.params;

    try {
      const updates = { ...req.body };
      // Verificar si se proporcionaron nuevas imágenes y actualizar los nombres de archivo correspondientes
      if (req.files) {
        if (req.files['avatar']) updates.avatar = req.files['avatar'][0].filename;
        if (req.files['frente']) updates.frente = req.files['frente'][0].filename;
        if (req.files['dorso']) updates.dorso = req.files['dorso'][0].filename;
      }
  
      // Actualizar el usuario en la base de datos
      const updatedUser = await registroModel.findOneAndUpdate(
        { dni: dni },
        updates,
        { new: true } // Devolver el usuario actualizado en lugar del usuario antes de la actualización
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Respuesta exitosa
      res.status(200).json({ message: "Usuario actualizado correctamente", user: updatedUser });
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      res.status(500).json({ message: "Error interno del servidor al actualizar datos" });
    }
  });

// Ruta para crear un nuevo usuario
router.post('/users', uploader.fields([{name:'frente', maxCount:1}, {name:'dorso', maxCount:1}]), processImageUpload, async (req, res) => {
  // Extraer datos del cuerpo de la solicitud
  const {nombre, apellido, dni, domicilio, celular, fechaNacimiento, email, password} = req.body;
  const frente = req.files['frente'] ? req.files['frente'][0].filename : null; 
  const dorso = req.files['dorso'] ? req.files['dorso'][0].filename: null;
  const passwordHash = await bcrypt.hash(password, 10)
  
  
  // Validar el formato del DNI
  if(!/^\d{8}$/.test(dni)){
    return res.status(400).send({status: 'error', message: 'El numero de documento (DNI) debe contener excatamente 8 digitos.'});
  }

  try{
    // Verificar si el usuario ya existe
    const existingUser = await registroModel.findOne({ dni: dni });
        if (existingUser) {
            return res.status(400).json({message:'El usuario con este DNI ya está registrado.'});
        }
    
    // Crear un nuevo usuario
    const newUser = new registroModel({
        nombre,
        apellido,
        dni,
        domicilio,
        celular,
        fechaNacimiento,
        email,
        password: passwordHash,
        frente,
        dorso,

      });
      // Guardar el nuevo usuario en la base de datos
      await newUser.save();
      // Respuesta exitosa
      res.status(201).json({ message: 'User created successfully', user: newUser});
    } catch (error) {
      console.error("Error al crear el usuario", error);
      res.status(500).json({message:"Internal server error"});
    }
  });


// Ruta para iniciar sesión
router.post('/login', async(req, res) => {
  const {dni, password} = req.body
  try{
    const userFound = await registroModel.findOne({dni})

    if (!userFound) return res.status(400).json({message:"Usuario no encontrado"});

    const isMatch = await bcrypt.compare(password, userFound.password);

    if(!isMatch) return res.status(400).json({message:"Usuario o contraseña incorrecto"});

    // Crear token de acceso JWT
    const token = await createAccessToken({id:userFound._id});

    // Establecer el token como cookie
    res.cookie("token", token);
    res.json({
      id: userFound._id
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) =>{
  // Limpiar la cookie de token
  res.cookie('token', "", {
    expires: new Date(0)
  });
  return res.sendStatus(200);
})

// Rutas protegidas que requieren autenticación JWT
router.get('/verify', verifyToken)// Verificar token de acceso

// Obtener perfil de usuario
router.get('/profile', authRequired, async (req, res) => {
  try {
    // Buscar al usuario por su ID en la base de datos
    const userFound = await registroModel.findById(req.user.id)
    .populate('courses.course')
    // Verificar si el usuario no fue encontrado
    if (!userFound) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Devolver el perfil del usuario en formato JSON
    return res.json({
      id: userFound._id,
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      dni: userFound.dni,
      domicilio: userFound.domicilio,
      celular: userFound.celular,
      fechaNacimiento: userFound.fechaNacimiento,
      email: userFound.email,
      role: userFound.role,
      avatar: userFound.avatar,
      nickname: userFound.nickname,
      course: userFound.courses.map(course=> course.course)
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante la búsqueda del usuario
    console.error("Error al buscar el perfil del usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

//recuperacion contraseña
router.post('/users/forgotPassword', async (req, res) =>{
  const {dni} = req.body
  try{
    const user = await registroModel.findOne({dni})
    if(!user){
      return res.status(400).json({message: 'Usuario invalido'})
    }
    const resetToken = user.createResetPasswordToken();

    await user.save({validateBeforeSave: false});
   
    const resetUrl = `${URL}/resetpassword/${resetToken}`
    const message = `Hemos recibido una peticion de restablecimiento de contraseña, siga el siguiente link e introduzca su nueva contraseña\n\n${resetUrl}\n\nEste link estara disponible por 10 min.`
    await sendMail({
      email: user.email,
      message: message
    });
    res.status(200).json({
      status:'success',
      message:'Link de restablecimiento de contraseña enviado'
    })
  }catch (error){
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

router.patch('/users/resetpassword/:token', async (req, res) => {
  try {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await registroModel.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}});
    
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const password =  req.body.password;

    if (!password) {
      return res.status(400).json({ message: 'La contraseña no puede estar vacía' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    user.password = passwordHash;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Contraseña Restablecida'
    });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get('/messages', async(req, res) =>{
  try{
    const mensajes = await mensajeModel.find().sort({ fecha: 1 }); // Ordena los mensajes por fecha ascendente
    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    res.status(500).send('Error interno del servidor');
  }
});

    
export default router;