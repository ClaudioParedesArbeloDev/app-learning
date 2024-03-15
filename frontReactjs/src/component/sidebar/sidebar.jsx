import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaUser,FaLayerGroup, FaBook, FaCommentDots, FaBell  } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

import './sidebar.css';



const Sidebar = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {setIsOpen(!isOpen);
        }
    
    const { logout } = useAuth();

    const [user, setUser] = useState({});
        
        
        
        useEffect(() => {
            
            //Obtiene los datos de la base de datos                
            axios.get(`http://localhost:8000/api/profile`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la ficha individual:', error);
                
            });
        },[])
    
    
    
    const menuItem=[
    {
        path:"/perfil",
        name:"perfil",
        icon:<FaUser/>
    },
    {
        path:"/plataforma",
        name:"plataforma",
        icon:<FaLayerGroup />
    },
    {
        path:"/clases",
        name:"clases",
        icon:<FaBook />
    },
    {
        path:"/chat",
        name:"chat",
        icon:<FaCommentDots />
    },
    {
        path:"/notificaciones",
        name:"notificaciones",
        icon:<FaBell />
    },
]
    return(
        <div className='containerSidebar'>
            <div style={{width: isOpen ? "300px" : "50px"}} className="sidebar">
                <div className='top_sectionSidebar'>
                    <div style={{marginLeft: isOpen ? "50px" : "0px"}} className='barsSidebar'>
                            <FaBars className='iconoSidebar' style={{marginLeft: isOpen ? "200px" : "0px"}} onClick={toggle}/>
                    </div>
                    <img src="/img/avatar.png" alt="" style={{width: isOpen ? "100px" : "40px"}}/>
                    <h2 style={{display: isOpen ? "block" : "none"}}>Nombre Apellido</h2>
                </div>
                {
                    menuItem.map((item, index) =>(
                        <NavLink to={item.path}
                        key={index}
                        className="linkSidebar"
                        activeclassname="active">
                            <div className='iconSidebar'>{item.icon}</div>
                            <div className='link_textSidebar'>{item.name}</div>
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
            <main className='mainSidebar'>{children}</main>
        </div>
    )
}

export default Sidebar;