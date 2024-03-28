import mongoose from "mongoose";

const contenidoSchema = mongoose.Schema({
    title: String,
    video1: String,
    video2: String,
    pdf: String,
    powerPoint: String
})

const contenidoModel = mongoose.model('contenidos', contenidoSchema)

export default contenidoModel

