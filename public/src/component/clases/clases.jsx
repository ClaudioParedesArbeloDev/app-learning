//Modulos
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { CurrentURL } from '../../api/url'

//Estilos
import './clases.css'



const Clases = () => {
    
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newContent, setNewContent] = useState({
        title:'',
        video1: '',
        video2: '',
        pdf: '',
        powerPoint:''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewContent({ ...newContent, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${CurrentURL}/api/courses/${selectedCourse}/add-content`, newContent);
            setNewContent({
                title: '',
                video1: '',
                video2: '',
                pdf: '',
                powerPoint: ''
            });
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    };
    
    useEffect(() => {
        axios.get(`${CurrentURL}/api/courses`)
        .then(response => {
            setCourses(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error al obtener los cursos', error);
            setError('Error al cargar los cursos. Por favor, intenta de nuevo más tarde.');
            setLoading(false);
        })
    }, [])

    const handleSelectCourse = (courseId) => {
        setSelectedCourse(courseId);
    };

    

    return(
        <main>
        {loading ? (
            <p>Cargando cursos...</p>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <div className='wrapperContenido'>
                <p>Elija el curso al cual cargar contenido</p>
                <select 
                    className='selectCourse' 
                    value={selectedCourse || ''} 
                    onChange={(e) => handleSelectCourse(e.target.value)}
                >
                    <option value="">Seleccione un curso</option>
                    {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
                
                <div>
                    
                    <form   onSubmit={handleSubmit} 
                            className='formRegistro' 
                            encType="multipart/form-data">
                                
                        <div className="input-boxR">
                            <input 
                                type="text" 
                                name="title" 
                                placeholder="Titulo" 
                                value={newContent.title} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-boxR">
                            <input 
                                type="text" 
                                name="video1" 
                                placeholder="Video 1" 
                                value={newContent.video1} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-boxR">
                            <input 
                                type="text" 
                                name="video2" 
                                placeholder="Video2" 
                                value={newContent.video2} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-boxR">
                            <input 
                                type="text" 
                                name="pdf" 
                                placeholder="pdf" 
                                value={newContent.pdf} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-boxR">
                            <input 
                                type="text" 
                                name="powerPoint" 
                                placeholder="PowerPoint" 
                                value={newContent.powerPoint} 
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        )}
    </main>
);
};



export default Clases