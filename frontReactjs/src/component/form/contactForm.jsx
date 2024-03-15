import {useForm} from './useForm.js'

const initialForm = {
    name:"",
    email:"",
    domicilio:""
}

const validationsForm = (form) => {
    let errors = {};

    if(!form.name){
        errors.name= "El campo 'Nombre' es requerido";
    }

    return errors
} 

const ContactForm = () => {
    const {
        form,
        errors,
        loading,
        response,
        handleChange,
        handleBlur,
        handleSubmit, 
     } = useForm(initialForm, validationsForm)
    return(
        <div>
            <h2>Formulario de Contacto</h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="text" 
                name='name' 
                placeholder='escribe tu nombre' 
                onBlur={handleBlur} 
                onChange={handleChange} 
                value={form.name} 
                required
                />
                {errors.name && <p>{errors.name}</p> }
                <input 
                type="email" 
                name='email' 
                placeholder='escribe tu email' 
                onBlur={handleBlur} 
                onChange={handleChange} 
                value={form.email} 
                required
                />
                <input 
                type="text" 
                name='domicilio' 
                placeholder='escribe tu domicilio' 
                onBlur={handleBlur} 
                onChange={handleChange} 
                value={form.domicilio} 
                required
                />
                <input type="submit" value="enviar"/>
            </form>
        </div>
    )
}

export default ContactForm