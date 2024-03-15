// Importar Axios para realizar solicitudes HTTP
import axios from "./axios";

// Función para enviar una solicitud de inicio de sesión al servidor
export const loginRequest = user => axios.post('/login', user);

// Función para enviar una solicitud de verificación de token al servidor
export const verifyTokenRequest = () => axios.get('/verify');



