//Modulos
import express from 'express';
import multer from "multer";
import bcrypt from 'bcryptjs'
import registroModel from "../models/register.model.js";
import { createAccessToken } from '../libs/jwt.js';
import { authRequired } from '../middlewares/validateToken.js';
import { verifyToken } from './auth.controller.js';

// Crear un enrutador de Express
const router=express.Router();


// Configurar el almacenamiento para multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, '/src/documentacion/') // Directorio donde se almacenarán los archivos
  },
  filename: function(req, file, cb) {
      const dni = req.body.dni; 
      const fileType = file.fieldname;
      const filename = `${dni}_${fileType}.jpg`;
        cb(null, filename);
  }
      
});

// Configurar multer con el almacenamiento y límites definidos
const uploader = multer({
  storage: storage,
  limits: {
      fileSize: 2 * 1024 * 1024 // Tamaño máximo del archivo: 2MB
  }
})


// Ruta para obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
      const users = await registroModel.find();
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
router.put('/users/:dni', async(req, res) =>{
  try {
    const userDni = req.params.dni;
    const updatedUser = await registroModel.findOneAndUpdate({"dni": userDni}, req.body);
    console.log(updatedUser)
    res.status(200).json({message: "Se actualizo correctamente", user: updatedUser})
  } catch (error) {
    console.error("Error al actualizar datos", error);
    res.status(500).json({message: "Internal server error"})
  }
 

});

// Ruta para crear un nuevo usuario
router.post('/users', uploader.fields([{name:'frente', maxCount:1}, {name:'dorso', maxCount:1}]), async (req, res) => {
    
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
      
      await newUser.save();// Guardar el nuevo usuario en la base de datos
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
    const userFound = await registroModel.findById(req.user.id);

    // Verificar si el usuario no fue encontrado
    if (!userFound) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Devolver el perfil del usuario en formato JSON
    return res.json({
      id: userFound._id,
      nombre: userFound.nombre,
      apellido: userFound.apellido,
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante la búsqueda del usuario
    console.error("Error al buscar el perfil del usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});
  
export default router;