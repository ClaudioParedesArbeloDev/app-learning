import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    title: String,
    description: String,
    professor: String,
})

const courseModel = mongoose.model('courses', courseSchema)

export default courseModel