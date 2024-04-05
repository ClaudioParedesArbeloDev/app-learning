import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { CurrentURL } from '../../api/url';

//Estilos
import './plataforma.css';



//Logica
const PlataformaComponent = () => {

    const [user, setUser] = useState({});

     //Obtiene los datos de la base de datos   
     useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${CurrentURL}/api/profile`, {withCredentials: true});

                // Verificar si la respuesta tiene el estado 304 (Not Modified)
                if (response.status === 304) {
                    // Si la respuesta es 304, no hay nuevos datos, puedes manejarlo como desees
                    console.log('No hay nuevos datos disponibles.');
                    return;
                }

                // Si la respuesta no es 304, actualiza los datos del usuario
                setUser(response.data);
                
            } catch (error) {
                console.error('Error al cargar el usuario:', error);
            }
        };

        fetchData();
    }, []);

    return(
        
        <main className='mainPlataforma'>

        <div >
           
            <h2>Mis Cursos</h2>
            
        </div>

        <h3>{`Hola ${user.nickname ? user.nickname : user.nombre}`}</h3>
        {!user.course ? <></> :
        <div className='wrapperAllCourses'>
            {user.course && user.course.map((course, index) => (
                
                <div className='wrapperCourses' key={index}>
                    <NavLink to={course.title}>
                    <div className='wrapperCourse'>
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                    </div>
                    </NavLink>
                </div>
                
            ))}
        </div>}

        {user.role === "admin" ? 
        <div className='buttonAdmin'>
        <Link to="/plataforma/clases">Clases</Link>
        <Link to="/listado">Listado</Link>
        </div> 
        : <></>}
        
        </main>
        
    )
}

export default PlataformaComponent