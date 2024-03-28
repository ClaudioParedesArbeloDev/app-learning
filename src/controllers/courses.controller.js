import express from 'express'
import courseModel from '../models/course.model.js'
import registroModel from '../models/register.model.js';
import contenidoModel from '../models/contenido.model.js';

// Crear un enrutador de Express
const router=express.Router();

//Crear un curso nuevo
router.post('/courses', async (req, res) =>{
    const {title, description, professor} = req.body;
    try{
        const newCourse = new courseModel({
            title,
            description,
            professor
        });
        await newCourse.save();
        res.status(201).json({message: 'Course created successfully', couse: newCourse});
        }catch (error){
            console.error("Error al crear el curso", error);
            res.status(500).json({message:"Internal server error"});
        }

    });

//Me muestra todos los cursos
router.get('/courses', async(req, res) => {
    try{
        const courses = await courseModel.find();
        res.status(200).json(courses);
    }catch (error) {
        console.error("Error al obtener cursos:", error);
        res.status(500).json({message: "Internal server error"})
    }
})

router.get('/courses/:title', async(req, res) => {
    try{
        const {title} = req.params;
        const course = await courseModel.findOne({title})
        .populate('contenidos.contenido')
                
        res.status(200).json({
            title: course.title,
            description: course.description,
            professor: course.professor,
            contenido: course.contenidos.map(contenido=>contenido.contenido)
        });
    }catch (error){
        console.error("error al traer el curso:", error)
        res.status(500).json({message: "internal server error"})
    }
})

//Agrego el curso por dni
router.put('/courses/:dni', async(req, res) =>{
        try{
            const {dni} = req.params
            const userLoader = await registroModel.findOne({dni})
            const {title} = req.body
            const courseFind = await courseModel.findOne({title})
            userLoader.courses.push({course: courseFind._id})
            const updateCourse = await registroModel.updateOne({_id:userLoader._id}, userLoader);

            if(!updateCourse){
                return res.status(404).json({message:'Curso no encontrado'});
            }

            res.status(200).json({message: "Curso actualizado correctamente", course: updateCourse});

        }catch (error){
            console.error("Error al actualizar el curso", error);
            res.status(500).json({message:"Error interno del servidor"})
        }
     })

//creo contenidos de las clases
router.post('/contenidos', async(req, res) => {
    const {title, video1, video2, pdf, powerPoint} = req.body
    try{
       const newContenido = new contenidoModel({
        title,
        video1,
        video2,
        pdf,
        powerPoint
       });
       await newContenido.save()
    res.status(201).json({message: 'Contenido created successfully', course: newContenido});
    }catch (error){
    console.error("Error al crear el contenido", error);
    res.status(500).json({message:"Internal server error"});
}
})

router.post('/courses/:courseId/add-content', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, video1, video2, pdf, powerPoint } = req.body;

        // Buscar el curso por su ID
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        // Crear un nuevo documento de contenido
        const newContenido = new contenidoModel({
            title,
            video1,
            video2,
            pdf,
            powerPoint
        });
        await newContenido.save();

        // Agregar el ID del nuevo contenido al array de contenidos del curso
        course.contenidos.push({ contenido: newContenido.id });
        await course.save();

        res.status(201).json({ message: 'Contenido agregado al curso exitosamente', contenido: newContenido });
    } catch (error) {
        console.error("Error al agregar contenido al curso", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});



export default router
    
