//Modulos
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { CurrentURL } from '../../api/url';


//Estilos
import './registro.css'

//Validacion de campos
const validateForm = (formData) => {
    let errors = {};
    if(!formData.nombre){
        errors.nombre="Ingrese su 'Nombre' por favor";
    }
    if(!formData.apellido){
        errors.apellido="Ingrese su 'Apellido' por favor";
    }
    if(!formData.domicilio){
        errors.domicilio="Ingrese su 'Domicilio' por favor";
    }
    if(!formData.celular){
        errors.celular="Ingrese su 'Nro. de Celular' por favor";
    }
    if(!formData.fechaNacimiento){
        errors.fechaNacimiento="Ingrese su 'Fecha de Nacimiento' por favor";
    }
    if(!formData.email){
        errors.email="Ingrese su 'email' por favor";
    }
    if(!formData.password){
        errors.password="Ingrese su 'Password' por favor";
    }
    if(formData.password !== formData.repitaPassword){
        errors.repitaPassword="El password no coincide, verifique su password";
    }
    return errors;
}

//Logica
const Registro = () => {
    //Estado en blanco de los diferentes campos
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        domicilio: '',
        celular: '',
        email: '',
        password: '',
        repitaPassword: '',
        frente: null,
        dorso: null,
    });

    //Cambiar estado y redireccionar
    const [redirect, setRedirect] = useState(false);

    //Maneja el estado de los errores
    const [errors, setErrors] = useState({});

    //Maneja la imagen frente del dni
    const [frente, setFrente] = useState(null);

    //Maneja la imagen dorso del dni
    const [dorso, setDorso] = useState(null);



    function handleFrente(event) {
        setFrente(event.target.files[0]);
    }

    function handleDorso(event) {
        setDorso(event.target.files[0]);
    }
    
    //Maneja el cambio en los campos, obteniendo los datos rellenados
    const handleChange = (e) => {
       if(e.target.name === 'frente' || e.target.name === 'dorso') {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
       }else {
        setFormData ({ ...formData, [e.target.name]: e.target.value });
       }
    };
       
            
    //Maneja el estado de cuando pierde el foco del campo 
    //(cuando el usuario pasa de campo y no pasa la validacion)
    const handleBlur = async (e) => {
        const { name, value } = e.target;
        const fieldErrors = validateForm({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: fieldErrors[name] });
    }

   
    //Muestra los errores a traves de Sweet Alert
    const showErrorAlert= (title, text) => {
        Swal.fire({
            title: title,
            text: text,
            confirmButtonText: 'Aceptar'
        });
    };

    //Envia los datos
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('apellido', formData.apellido);
        formDataToSend.append('dni', formData.dni);
        formDataToSend.append('domicilio', formData.domicilio);
        formDataToSend.append('celular', formData.celular);
        formDataToSend.append('fechaNacimiento', formData.fechaNacimiento);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('frente', frente);
        formDataToSend.append('dorso', dorso);
        //Intenta enviar los datos recolectados
        try {
             await axios.post(`${CurrentURL}/api/users`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(formDataToSend)
            setRedirect(true);
        } catch (error) {
            console.error('Error al enviar datos:', error);
            if(error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message || 'Ocurrio un error al procesar la solicitud'
                showErrorAlert('Error', errorMessage);
            } else{
                showErrorAlert('Error', 'Ocurrio un error al procesar la solicitud');
            }
        }
    };

    //Redirije si fue con exito la registracion
    if (redirect) {
        return <Navigate to="/sucessreg" />
    }



    return(
      <form onSubmit={handleSubmit} className="formRegistro" encType="multipart/form-data">
            
            <div className="input-boxR">
                <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre Completo" 
                value={formData.nombre} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.nombre && <p className='errorsForm'>{errors.nombre}</p>}
            
            <div className="input-boxR">
                <input 
                type="text" 
                name="apellido" 
                placeholder="Apellido" 
                value={formData.apellido} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.apellido && <p className='errorsForm'>{errors.apellido}</p>}
            
            <div className="input-boxR">
                <input 
                type="text" 
                name="dni"  
                placeholder="Numero de documento (sin puntos, ni separaciones)" 
                value={formData.dni} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.dni && <p className='errorsForm'>{errors.dni}</p>}
            
            <div className="input-boxR">
                <input 
                type="text" 
                name="domicilio" 
                placeholder="Domicilio" 
                value={formData.domicilio} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.domicilio && <p className='errorsForm'>{errors.domicilio}</p>}
            
            <div className="input-boxR">
                <input 
                type="text" 
                name="celular"  
                placeholder="Nro Celular" 
                value={formData.celular} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.celular && <p className='errorsForm'>{errors.celular}</p>}
            
            <div className="input-boxR">
                <input 
                type="text" 
                name="fechaNacimiento"  
                placeholder="Fecha Nacimiento" 
                value={formData.fechaNacimiento} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.fechaNacimiento && <p className='errorsForm'>{errors.fechaNacimiento}</p>}
            
            <div className="input-boxR">
                <input 
                type="email" 
                name="email" 
                placeholder="Correo Electrónico" 
                value={formData.email} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.email && <p className='errorsForm'>{errors.email}</p>}
            
            <div className="input-boxR">
                <input 
                type="password" 
                name="password"  
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.password && <p className='errorsForm'>{errors.password}</p>}
            
            <div className="input-boxR">
                <input 
                type="password" 
                name="repitaPassword"  
                placeholder="Repita Password"
                onChange={handleChange}
                onBlur={handleBlur}
                required
                />
            </div>
            {errors.repitaPassword && <p className='errorsForm'>{errors.repitaPassword}</p>}
            
            <div className="fileDNI">
                <label 
                htmlFor="dniFrente" 
                className="custom-file-upload">
                <input 
                type="file" 
                id="dniFrente" 
                name="frente" 
                onChange={handleFrente}
                />
                foto frente DNI
                </label>
            </div>
            
            <div className="fileDNI">
                <label 
                htmlFor="dniDorso" 
                className="custom-file-upload">
                <input 
                type="file" 
                id="dniDorso" 
                name="dorso" 
                onChange={handleDorso}
                />
                foto dorso DNI
                </label>
            </div>
            
            <button type="submit" className="submitForm">Enviar</button>
            <p className="advertenciaTamano">Las imagenes no pueden superar los 2mb.</p>
        
        </form>     
    )
}


export default Registro