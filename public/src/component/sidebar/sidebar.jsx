//Modulos
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaUser,FaHome, FaCommentDots } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CurrentURL } from '../../api/url';



//Estilos
import './sidebar.css';


//Logica
const Sidebar = ({children}) => {
    // Estado para controlar el estado del sidebar (abierto/cerrado)
    const [isOpen, setIsOpen] = useState(false);
    // Función para alternar el estado del sidebar
    const toggle = () => {setIsOpen(!isOpen)}
    // Uso del contexto de autenticación para obtener la función de cierre de sesión
    const { logout } = useAuth();
    // Estado para almacenar los datos del usuario
    const [user, setUser] = useState({});

    const [avatarUrl, setAvatarUrl] = useState('');
   
    // Efecto para cargar los datos del usuario al montar el componente 
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
                setAvatarUrl(response.data.avatar ? `${CurrentURL}/img/documentacion/${response.data.dni}/${response.data.avatar}` : `${CurrentURL}/img/avatar.png`);
            } catch (error) {
                console.error('Error al cargar el usuario:', error);
            }
        };

        fetchData();
    }, []);
    
    // Array de objetos que define los elementos del menú y sus rutas correspondientes
    const menuItem=[
        {
        path:"/plataforma",
        name:"mis cursos",
        icon:< FaHome/>
        },
        {
        path:"/perfil",
        name:"perfil",
        icon:<FaUser/>,
        },
    
    
        {
        path:"/chat",
        name:"chat",
        icon:<FaCommentDots />
        },
    
    ]
    return(
        <div className='containerSidebar'>
            <div style={{width: isOpen ? "300px" : "50px"}} className="sidebar">
                <div className='top_sectionSidebar'>
                    <div style={{marginLeft: isOpen ? "50px" : "0px"}} className='barsSidebar'>
                            <FaBars className='iconoSidebar' style={{marginLeft: isOpen ? "200px" : "0px"}} onClick={toggle}/>
                    </div>
                   { <img src={avatarUrl} alt="" style={{width: isOpen ? "100px" : "40px", height: isOpen ? "100px" : "40px"}}/>}
                    <h2>{isOpen ? user.nombre : ''} </h2>
                    <h2>{isOpen ? user.apellido : ''} </h2>
                </div>
                {
                    menuItem.map((item, index) =>(
                        <NavLink to={item.path}
                        key={index}
                        className="linkSidebar"
                        activeclassname="active">
                            <div className='iconSidebar'>{item.icon}</div>
                            <div className='link_textSidebar'>{isOpen ? item.name : ''}</div>
                        </NavLink>
                    ))
                }
                <div className='logout' style={{width: isOpen ? "300px" : "50px"}}>
                <Link to= "/" onClick={() => {logout()}}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <p style={{display: isOpen ? "block" : "none"}}>logout</p>
                </Link>
                </div>
            </div>
            <div className="contentArea">
                {children}
            </div>
                
        </div>
    )
    }

export default Sidebar;