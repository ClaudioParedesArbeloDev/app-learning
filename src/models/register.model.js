import mongoose from "mongoose";


const registroCollection = 'alumnos2024'

const registroSchemma = new mongoose.Schema({
    nombre: String,
    apellido: String,
    dni: {
        type: Number,
        unique: true
    },
    domicilio: String,
    celular: Number,
    fechaNacimiento: String,
    email: String,
    password: String,
    frente: String,
    dorso: String,
    avatar: String,
    nickname: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    courses: {
        type:[
            {
                course:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "courses"
                }
            }
        ],
        default:[]
    }
}, {
    timestamps: true
})

const registroModel = mongoose.model(registroCollection, registroSchemma)

export default registroModel 