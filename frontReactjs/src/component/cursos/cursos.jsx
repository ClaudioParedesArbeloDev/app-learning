import './cursos.css'


const Cursos = () => {
    return(
        <div id='topPage'>
        <section className="cursoFrontEnd">
           
            <h2>Curso FrontEnd</h2>
            <a href="#desarrolloWeb" className="partCurso"><h3><i className="fa-solid fa-code"></i>Desarrollo Web</h3></a>
            <a href="#javaScript"className="partCurso"><h3><i className="fa-brands fa-js"></i>JavaScript</h3></a>
            <a href="#reactJs"className="partCurso"><h3><i className="fa-brands fa-react"></i>ReactJs</h3></a>
        </section>
        <section id="desarrolloWeb" className="desarrolloWeb">
            <h3><i className="fa-solid fa-code"></i>Desarrollo Web</h3>
            <p>Introducción al Desarrollo Web</p>
            <p>Prototipado y conceptos básicos de HTML</p>
            <p>Primeros pasos con HTML</p>
            <p>Incluyendo CSS a nuestro proyecto</p>
            <p>CSS+Box Modeling</p>
            <p>Flexbox</p>
            <p>GRIDS</p>
            <p>Animaciones, transformaciones y transiciones</p>
            <p>GIT</p>
            <p>GITHUB</p>
            <p>Frameworks CSS+Bootstrap</p>
            <p>@Media+Pseudoclases</p>
            <p>SASS</p>
            <p>Servidores y SEO para tu sitio</p>
            <p>Subida al servidor</p>
            <p>Conociendo a nuestro cliente</p>
            <p>Proyecto Final</p>
        </section>
<section id="javaScript" className="javaScript">
  <h3><i className="fa-brands fa-js"></i>JavaScript</h3>
  <p>Introducción a JavaScript + Onboarding</p>
  <p>Conceptos generales: Sintaxis y variables</p>
  <p>Control de flujos</p>
  <p>Ciclos e iteraciones</p>
  <p>Funciones</p>
  <p>Objetos</p>
  <p>Arrays</p>
  <p>Funciones de orden superior</p>
  <p>DOM</p>
  <p>Eventos</p>
  <p>Storage & JSON</p>
  <p>Workshop</p>
  <p>Operadores avanzados</p>
  <p>Librerías</p>
  <p>Asincronía y promesas</p>
  <p>Ajax & Fetch</p>
  <p>Frameworks & NodeJS</p>
  
</section>
<section id="reactJs" className="reactJs">
  <h3><i className="fa-brands fa-react"></i>ReactJs</h3>
  <p>Nivelación + Onboarding</p>
  <p>Instalación y configuración del entorno</p>
  <p>JSX y transpiling</p>
  <p>Componentes</p>
  <p>Promises, asincronía y MAP</p>
  <p>Consumiendo API's</p>
  <p>Routing y navegación</p>
  <p>Eventos</p>
  <p>Context</p>
  <p>Técnicas de rendering</p>
  <p>Firebase</p>
  <p>WorkShop</p>
</section>
<a href="/cursos" className="up"><i className="fa-regular fa-circle-up"></i></a>
</div> 
    )
}


export default Cursos