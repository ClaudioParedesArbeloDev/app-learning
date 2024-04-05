//Modulos
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

//Estilo
import './contrasena.css';


//Logica
const Contraseña = () => {

    //Cuenta regresiva para redirigir la pagina
    const [countdown, setCountdown] = useState(10);

    //Logica de ir descontando 1 seg. a la cuenta regresiva
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    //Retorna el contenido de la pagina y su cuenta regresiva
    return (
        <main className="registroCompletado">
            <h2>Para restablecer su contraseña, siga el link que fue enviando a su email</h2>
            <p>En <span id="countdown">{countdown}</span> segundos será redirigido a la página principal...</p>
            {countdown === 0 && <Navigate to="/" />}
        </main>
    );
};

export default Contraseña;
