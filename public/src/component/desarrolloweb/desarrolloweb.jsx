import { useEffect, useState } from 'react';
import axios from 'axios';
import { CurrentURL } from '../../api/url';
import { Link } from 'react-router-dom';


import './desarrolloweb.css'

const Desarrolloweb = () => {

    const [clase, setClase] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try{
                const courseTitle = "Desarrollo Web"
                const response = await axios.get(`${CurrentURL}/api/courses/${courseTitle}`, {withCredentials: true})
                setClase(response.data)
                
                
                
            }catch (error){
                console.error('Error al cargar el curso', error);
            }
        };
        fetchData();
    },[]);

    return (
        <main>
            <h2 className='encabezadoCursos'>{clase.title}</h2>
            {!clase.contenido ? <p>No hay contenido</p> :
            <div className='contenidoCurso'>
                {clase.contenido && clase.contenido.map((contenido, index) => (
                    <div className='wrapperClasses' key={index}>
                        <p className='tituloClase'>{contenido.title}</p>
                        <Link className='grabacionClaseLunes' to={contenido.video1}><p>video lunes</p></Link>
                        <Link className='grabacionClaseMartes' to={contenido.video2}><p>video martes</p></Link>
                        <Link className='materialClase' to={contenido.powerPoint}><p>PowerPoint</p></Link>
                        <Link className='pdfClase' to={contenido.pdf}><p>pdf</p></Link>
                    </div>
                ))}
                
            </div>}
        </main>
    )
}

export default Desarrolloweb;