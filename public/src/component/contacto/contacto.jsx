import './contacto.css'

const Contacto = () => {
    return (
    <section className= "wrapperFormulario">
        <div className="formularioContacto">
            <div className="formContainer">
                <div className="box-info">
                    <h1>Contáctate con nosotros</h1>
                <div className="data">
                    <p><i className="fa-solid fa-phone"></i>+54 9 341 3181379</p>
                    <p><i className="fa-solid fa-envelope"></i>claudioparedesarbelo@gmail.com</p>
                    <p><i className="fa-solid fa-location-dot"></i>Av. Arijon 515 - Rosario - Argentina</p>
                </div>
                <div className="linkF">
                    <a href="https://www.instagram.com/claudioparedes_developer/" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-instagram"></i></a>
                    <a href="https://www.linkedin.com/in/claudioparedesarbelo/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
                    <a href="https://twitter.com/ClaudioPDev" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-x-twitter"></i></a>
                    <a href="https://www.youtube.com/channel/UC8obibrcBZa2FwGN6J9rJSA" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-youtube"></i></a>
                    <a href="https://github.com/ClaudioParedesArbeloDev" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-github"></i></a>
                    <a href="https://wa.me/5493413181379" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-whatsapp"></i></a>
                </div>
            </div>
            <form className="formContacto" action="https://formsubmit.co/932d88bc19abf67082ce684ef6bbb554" method="POST">
                <div className="input-boxF">
                    <input type="text" name="name" placeholder="Nombre y Apellido"/>
                    <i className="fa-solid fa-user"></i>
                </div>
                <div className="input-boxF">
                    <input type="email" name="email" required placeholder="Correo Electrónico"/>
                    <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="input-boxF">
                    <input type="text" name="asunto" required placeholder="Asunto"/>
                    <i className="fa-solid fa-pen"></i>
                </div>
                <div className="input-boxF">
                    <textarea id="" cols="30" rows="10" name="comentario" placeholder="Escribe tu mensaje"></textarea>
                </div>
                <button type="submit">Enviar</button>

                <input type="hidden" name="_next" value="https://claudioparedes.site"/>
                <input type="hidden" name="_captcha" value="false"/>
            </form>
        </div>
    </div>
    </section>
    )
}

export default Contacto;