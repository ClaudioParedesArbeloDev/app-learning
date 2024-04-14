import mongoose from "mongoose";


const mensajeCollection = 'chat'

const mensajeSchema = new mongoose.Schema({
    usuario: String,
    mensaje: String,
    fecha: { type: Date, default: Date.now }
  });
  
  const mensajeModel = mongoose.model(mensajeCollection, mensajeSchema);
  

  export default mensajeModel;