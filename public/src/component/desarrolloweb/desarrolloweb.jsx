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
                        {!contenido.video1 ? <></>:
                        <Link className='grabacionClaseLunes' to={contenido.video1} target='_blank'><p>video lunes</p></Link>}
                        {!contenido.video2 ? <></> :
                        <Link className='grabacionClaseMartes' to={contenido.video2} target='_blank'><p>video martes</p></Link>}
                        {!contenido.powerPoint ? <p></p> :
                        <Link className='materialClase' to={contenido.powerPoint} target='_blank'><p>PowerPoint</p></Link>}
                        {!contenido.pdf ? <></> :
                        <Link className='pdfClase' to={contenido.pdf} target='_blank'><p>pdf</p></Link>}
                    </div>
                ))}
                
            </div>}
        </main>
    )
}

export default Desarrolloweb;