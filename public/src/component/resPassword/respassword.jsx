import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { CurrentURL } from '../../api/url';

import './respassword.css'

const ResPassword = () => {

    const [dni, setDNI] = useState('');
    const [redirect, setRedirect] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${CurrentURL}/api/users/forgotPassword`, { dni });
            setRedirect(true);
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    };

    if (redirect) {
        return <Navigate to="/contrasena" />;
    }

    return(
        <div className='wrapperResPassword'>
            <form 
            onSubmit={handleSubmit}
            className='formPas'  >
                <h2>Recuperar Contraseña</h2>
                <p className='textResPas'>Ingrese su DNI para reestablecer su contraseña</p>
                <input 
                    className="input-resPas"
                    type="text" 
                    name="dni"
                    placeholder="Ingrese su DNI"
                    value={dni}
                    onChange={(e) => setDNI(e.target.value)}
                    />
                
                
                <button className='btnPass' type='submit'>enviar</button>
            </form>

        </div>
    )
}

export default ResPassword