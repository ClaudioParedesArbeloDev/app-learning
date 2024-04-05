//Modulos
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';



//Estilos
import './Login.css'


//Logica
const LoginBox = () => {

    // Utilizar hook useForm para manejar el formulario
    const {register, handleSubmit, formState:{errors}} = useForm();

    // Utilizar el contexto AuthContext para manejar la autenticación
    const {signin, errors: LoginErrors, isAuthenticated} = useAuth();

    // Utilizar hook useNavigate para manejar la navegación
    const navigate = useNavigate();

    // Función para manejar el envío del formulario
    const onSubmit = handleSubmit(data => {
      signin(data);// Llamar a la función signin del contexto AuthContext
    })
     // Efecto secundario que se ejecuta cuando cambia el estado de autenticación
    useEffect(() => {
      // Redirigir al usuario a la plataforma si está autenticado
      if (isAuthenticated) {
        navigate("/plataforma");
      }
    }, [isAuthenticated, navigate]);
   
   // Renderizar el componente
    return(
          <section className="loginBoxTotal">
           <div className="loginBox">
            <div className="wrapper">
              <div className="form-box login">
                {
                  LoginErrors.map((error, i) =>(
                    <div className='errorLogin'>
                      {error}
                    </div>
                  ))   
                }
                <h2>Login</h2>
                <form onSubmit={onSubmit} >
                  <div className="input-box">
                    
                    <span className="icon">
                    <i className="fa-solid fa-id-card"></i>
                    </span>
                    <input  
                      type='text' {...register("dni", {required: true})} />
                      {errors.dni && (<p className='errorsLogin'>DNI is required</p>)}
                           
                    <label htmlFor='dni'>DNI</label>
                  </div>
                  <div className="input-box">
                    <span className="icon"><i className="fa-solid fa-lock"></i></span>
                    <input  type="password" {...register("password", {required: true})} />
                      {errors.password && (<p className='errorsLogin'>password is required</p>)}
                            
                    <label htmlFor='password'>Password</label>
                  </div>
                  <div className="remember-forgot">
                    <label><input type="checkbox"/>Recuerdame</label>
                    <Link to="/respassword">Olvidó su Password?</Link>
                    </div>
                    <button type="submit" className="btnr">Login</button>
                  <div className="login-register">
                    <p>No tienes cuenta?<Link to="./registro" className="register-link"> Regístrese</Link></p>
                  </div>
               </form>
              </div>
            </div>
          </div>
        </section>
        
        
    ) 
}

export default LoginBox