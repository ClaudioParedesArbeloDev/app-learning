import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ModalEdit from '../modaledit/modaledit';
import { CurrentURL } from '../../api/url';

import './perfil.css';

const PerfilComponent = () => {
    
    const [user, setUser] = useState({});

    const [avatarUrl, setAvatarUrl] = useState('');
    
    //Campo a modificar
    const [editField, setEditField] = useState('');

     //Modal para editar campos
    const [modalEdit, setModalEdit] = useState(false);

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
                        setAvatarUrl(response.data.avatar ? `${CurrentURL}/img/documentacion/${response.data.dni}/${response.data.avatar}` : `${CurrentURL}/img/avatar.png`);
                    } catch (error) {
                        console.error('Error al cargar el usuario:', error);
                    }
                };
        
                fetchData();
            }, []);
    
    const handleAvatarChange = useCallback(async (event) => {
        const file = event.target.files[0];

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axios.put(`${CurrentURL}/api/users/${user.dni}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUser(prevUser => ({
                ...prevUser,
                avatar: response.data.avatar
            }));
            window.location.reload();
            setAvatarUrl(response.data.avatar ? `${CurrentURL}/${user.dni}/${response.data.avatar}` : `${CurrentURL}/img/avatar.png`);
            
        } catch (error) {
            console.error('Error al actualizar el avatar:', error);
        }
    }, [user.dni]);


    //Manejo de campo a editar
    const handleEditField = (field) => {
        setEditField(field);
        setModalEdit(true);
    };
    
    //Sweet Alert para los errores
    const showErrorAlert= (title, text) => {
        Swal.fire({
            title: title,
            text: text,
            confirmButtonText: 'Aceptar'
        });
    };

    //Manejo de los datos a editar
    const handleUpdateField = (newValue) => {
        axios.put(`${CurrentURL}/api/users/${user.dni}`, { [editField]: newValue })
        .then(response => {
            setUser(prevUser => ({
                ...prevUser,
                [editField]: newValue
            }));
            setModalEdit(false);
        })
        .catch(error => {
            console.error('Error al actualizar campo:', error);
            showErrorAlert('Error', 'Ha ocurrido un error al actualizar el campo.');
        })
    }

       

    return(
        <main className='mainPerfil'>
            <div className='encabezadoPerfil'>
            <img src={avatarUrl} alt="avatar" className="avatarPerfil"/>
            <div className="btnAvatar">
                <label 
                htmlFor="avatar" 
                className="custom-file-upload">
                <input 
                type="file" 
                id="avatar" 
                name="avatar" 
                accept="image/*" 
                onChange={handleAvatarChange}
                />
                Seleccionar Imagen
                </label>
   
            </div>

            <p>NickName: {user.nickname}</p>
            
            <button className='btnPerfil' onClick={() => handleEditField('nickname') }>Editar NickName</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
            
            <h2>Cursos: </h2>
            {user.course && user.course.map((course, index) => (
                <div key={index}>
                    
                    <p>{course.title}</p>
                    
                </div>
                
            ))}
            </div>
            <div className="datosIndividuo">
                                <p>Nombre: {user.nombre}</p>
                                
                                <button className='btnPerfil' onClick={() => handleEditField('nombre') }>Editar Nombre</button>
                                
                                <p>Apellido: {user.apellido}</p>

                                <button className='btnPerfil' onClick={() => handleEditField('apellido') }>Editar Apellido</button>
                                
                                <p>Domicilio: {user.domicilio}</p>

                                <button className='btnPerfil' onClick={() => handleEditField('domicilio') }>Editar Domicilio</button>
                                
                                <p>Nro de celular: {user.celular}</p>

                                <button className='btnPerfil' onClick={() => handleEditField('celular') }>Editar Nro. Celular</button>
                                
                                <p>Fecha de Nacimiento: {user.fechaNacimiento}</p>
                                
                                <button className='btnPerfil' onClick={() => handleEditField('fechaNacimiento') }>Editar Fecha de Nac.</button>

                                <p>E-mail: {user.email}</p>
                               
                                <button className='btnPerfil' onClick={() => handleEditField('email') }>Editar E-mail</button>
            </div>
            
                            
        </main>
    )
}

export default PerfilComponent