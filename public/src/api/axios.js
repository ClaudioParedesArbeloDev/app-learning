// Importar Axios para realizar solicitudes HTTP
import axios from "axios";
import { CurrentURL } from "./url";

// Crear una instancia de Axios con una URL base y la configuración de credenciales de CORS
const instance = axios.create({
    baseURL:`${CurrentURL}/api/`,
    withCredentials: true
})

export default instance