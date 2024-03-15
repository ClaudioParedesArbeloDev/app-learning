//Modulos
import { createContext,  useContext, useEffect, useState } from "react";
import { loginRequest } from "../api/auth";
import Cookies from 'js-cookie'
import { verifyTokenRequest } from "../api/auth";

// Crear un contexto de autenticación
const AuthContext = createContext()

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () =>{
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}

// Componente proveedor de autenticación
export const AuthProvider = ({children}) => {
    // Estado para almacenar mensajes de error
    const [errors, setErrors] = useState([]);
    // Estado para almacenar información del usuario autenticado
    const [user, setUser] = useState(null);
    // Estado para verificar si el usuario está autenticado
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    // Estado para indicar si se está cargando la autenticación
    const [loading, setLoading] = useState(true)
    
    // Función para iniciar sesión
    const signin = async (user) => {
        try{
        const res = await loginRequest(user);
        
        setUser(res.data);
        setIsAuthenticated(true);
        
        }catch (error) {
          if (Array.isArray(error.response.data)){
            return setErrors(error.response.data)
          }
          setErrors([error.response.data.message])
        }

    };
    
    // Función para cerrar sesión
    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
      };

    //Borra el mensaje de error luego de 5 seg.
    useEffect(() => {
        if (errors.length > 0) {
          const timer = setTimeout(() => {
            setErrors([]);
          }, 5000);
          return () => clearTimeout(timer);
        }
      }, [errors]);

    
    // Verificar la autenticación al cargar la página
    useEffect(() => {
        const checkLogin = async() => {
            const cookies = Cookies.get();

            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }
            
            try{
                const res = await verifyTokenRequest(cookies.token);
                if(!res.data) return setIsAuthenticated(false);
                
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
                           
                               
                }catch (error) {
                setIsAuthenticated(false);
                setLoading(false);
                }
            }
        checkLogin();
    },[]);

    // Renderizar el proveedor de autenticación
    return(
        <AuthContext.Provider value={{
            
            signin,
            user,
            errors,
            isAuthenticated,
            loading,
            logout
            
            
        }}>
            {children}
        
        </AuthContext.Provider>
    )
}

export default AuthContext;