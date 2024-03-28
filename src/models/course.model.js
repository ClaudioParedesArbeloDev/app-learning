import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    title: String,
    description: String,
    professor: String,
    contenidos:{
        type:[
            {
                contenido:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "contenidos"
                }
            }
        ],
        default:[]
    }
})

const courseModel = mongoose.model('courses', courseSchema)

export default courseModel