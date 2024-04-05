//Modulos
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Modal from '../modal/modal';
import ModalEdit from '../modaledit/modaledit';
import { CurrentURL } from '../../api/url';

//Estilos
import './fichaind.css';

//Logica
const FichaIndividual = () => {

    //Obtiene el DNI de los parametros
    const { dni } = useParams();

    const [user, setUser] = useState({});

    const [selectedCourse, setSelectedCourse] = useState('');

    //Redirecciona la pagina una vez eliminado el user
    const navigate = useNavigate();

    //Modal para el DNI
    const [openModal, setOpenModal] = useState(false);

    //Inserta en el modal la imagen del DNI
    const [modalImage, setModalImage] = useState('');

    //Campo a modificar
    const [editField, setEditField] = useState('');

    //Modal para editar campos
    const [modalEdit, setModalEdit] = useState(false);

    //Obtiene los datos de la base de datos
    useEffect(() => {
        axios.get(`${CurrentURL}/api/users/${dni}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la ficha individual:', error);
                showErrorAlert('Error', 'Ha ocurrido un error al obtener la ficha individual.');
            });
    }, [dni]);

    
    //Sweet Alert para los errores
    const showErrorAlert= (title, text) => {
        Swal.fire({
            title: title,
            text: text,
            confirmButtonText: 'Aceptar'
        });
    };

    //Manejo del Modal
    const handleOpenModal = (image) => {
        setModalImage(image);
        setOpenModal(true);
    };

    
    //Manejo de campo a editar
    const handleEditField = (field) => {
        setEditField(field);
        setModalEdit(true);
    };

    //Manejo de los datos a editar
    const handleUpdateField = (newValue) => {
        axios.put(`${CurrentURL}/api/users/${dni}`, { [editField]: newValue })
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

    const handleCourses = () => {
        axios.put(`${CurrentURL}/api/courses/${dni}`, { title: selectedCourse })
          .then(response => {
            setUser(prevUser => ({
              ...prevUser,
              courses: [...prevUser.courses, response.data] // Asumiendo que el servidor devuelve el curso agregado
            }));
            setModalEdit(false);
          })
          .catch(error => {
            console.error('Error al agregar curso:', error);
            showErrorAlert('Error', 'Ocurrió un error al agregar el curso.');
          })
      }

    
    //Manejo del modal para la eliminacion de un user
    const handleDelete =() =>{
        Swal.fire({
            title: `Esta seguro de eliminar el alumno '${user.apellido}?`,
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(`${CurrentURL}/api/users/delete/${user.dni}`)
                    .then(() => {
                            Swal.fire(
                            '¡Eliminado!',
                            'El usuario ha sido eliminado correctamente.',
                            'success'
                        );
                        navigate('/listado');
                    })
                    .catch(error => {
                        console.error('Error al eliminar el usuario:', error);
                        showErrorAlert('Error', 'Ha ocurrido un error al eliminar el usuario.');
                    });
            }
        });
    };

    

    return(
               
            <div>
                
                <section className="individualPage">
                    <div className="wrapperIndividual">
                    <img src={user.avatar ? `${CurrentURL}/img/${user.dni}/${user.avatar}` : `${CurrentURL}/img/avatar.png`} alt="avatar" className="avatar"/>

                        <div className="tablaGeneral">
                            <div className="encabezadosIndividuo">
                                <p>nombre:</p>
                                <p>apellido:</p>
                                <p>nro documento:</p>
                                <p>domicilio:</p>
                                <p>nro celular:</p>
                                <p>fecha de nacimiento:</p>
                                <p>e-mail:</p>
                                <p>cursos:</p>
                            </div>
                            <div className="datosIndividuo">
                                <p>{user.nombre}</p>
                                <p>{user.apellido}</p>
                                <p>{user.dni}</p>
                                <p>{user.domicilio}</p>
                                <p>{user.celular}</p>
                                <p>{user.fechaNacimiento}</p>
                                <p>{user.email}</p>
                                {user.courses && user.courses.length > 0 && (
                                <div>
    
                                    <ul>
                                        {user.courses.map(course => {
                                            console.log(course);
                                        return <li key={course._id}>{course.course.title}</li>
                                        })}
                                    </ul>
                                </div>
                                )}
                            </div>
                            <div className='btnUpdate'>
                                <button onClick={() => handleEditField('nombre') }>Editar</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
                                <button onClick={() => handleEditField('apellido') }>Editar</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
                                <button onClick={() => handleEditField('dni') }>Editar</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
                                <button onClick={() => handleEditField('domicilio') }>Editar</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
                                <button onClick={() => handleEditField('celular') }>Editar</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
                                <button onClick={() => handleEditField('fechaNacimiento') }>Editar</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
                                <button onClick={() => handleEditField('email') }>Editar</button>
                                {modalEdit && 
                                    <ModalEdit    
                                        closeModal={setModalEdit} 
                                        onAccept={(newValue) => handleUpdateField(newValue)} 
                                        fieldName={editField} 
                                        currentValue={user[editField]} 
                                    />
                                }
                                
                                <select className="cursosOptions" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                    <option  value="">Cursos</option>
                                    <option value="Desarrollo Web">Desarrollo Web</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="ReactJs">ReactJs</option>
                                </select>
                                <button onClick={handleCourses}>Agregar Curso</button>
                            </div>
                        </div>
                        <button className="frenteDNI" onClick={()=>handleOpenModal(user.frente)}>DNI Frente</button>
                        <button className="dorsoDNI" onClick={()=>handleOpenModal(user.dorso)}>DNI Dorso</button>
                        <button className="deleteBTN" onClick={handleDelete}>Eliminar</button>
                    </div>
                </section>
        
                <section className="modalDNIfrente">
    
    
    
                </section>
                {openModal && <Modal user={user} images={modalImage}  closeModal={setOpenModal}/>}
                <section className="modalDNIdorso">
                    
                </section>         
                <div className="wrapperBtnListado">
                    <button className="btnListado"><a href="/listado">listado</a></button>
                </div>
            </div>
        );
    }   

export default FichaIndividual;
