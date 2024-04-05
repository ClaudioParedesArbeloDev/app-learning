import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { CurrentURL } from '../../api/url';
import { useParams } from 'react-router-dom';

import "./resetpassword.css"

const ResetPassword = () => {
    const { token } = useParams(); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            const data = {
                password: password
            };
            await axios.patch(`${CurrentURL}/api/users/resetpassword/${token}`, data);
            setRedirect(true);
        } catch (error) {
            console.error('Error al enviar datos:', error);
            setError('Error al restablecer la contraseña. Por favor, inténtelo de nuevo.');
        }
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return(
        <div className='wrapperResetPassword'>
            <form 
            onSubmit={handleSubmit}
            className='formRes'  >
                <h2>Restablecer Contraseña</h2>
                {error && <p className='error'>{error}</p>}
                <p className='textResPas'>Ingrese su Contraseña</p>
                <input 
                    className="input-resetPas"
                    type="password" 
                    name="password"
                    placeholder="Ingrese su Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                <p className='textResPas'>Repita su Contraseña</p>
                <input 
                    className="input-resetPas"
                    type="password" 
                    name="confirmPassword"
                    placeholder="Repita su Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                
                
                <button className='btnPass' type='submit'>enviar</button>
            </form>

        </div>
    )
}

export default ResetPassword