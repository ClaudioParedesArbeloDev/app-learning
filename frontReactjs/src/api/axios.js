// Importar Axios para realizar solicitudes HTTP
import axios from "axios";

// Crear una instancia de Axios con una URL base y la configuración de credenciales de CORS
const instance = axios.create({
    baseURL:"http://localhost:8000/api",
    withCredentials: true
})

export default instance