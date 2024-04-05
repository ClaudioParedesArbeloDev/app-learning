import mongoose from "mongoose";
import crypto from 'crypto'


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
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
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

registroSchemma.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    console.log(resetToken, this.passwordResetToken);

    return resetToken;
}

const registroModel = mongoose.model(registroCollection, registroSchemma)

export default registroModel 