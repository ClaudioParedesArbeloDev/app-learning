import { Link } from "react-router-dom";

import "./Navbar.css";


const Navbar = () => {
  return (
    <header>
      <div className="title">
        <img src="/img/fullstack.svg" alt="logo" />
        <div>
          <h1>Claudio Paredes Arbelo</h1>
          <p>Desarrollador Fullstack y Educador</p>
        </div>
      </div>
      <nav>
        <div className="buttons" id="nav">
          <span id="close">
            <i className="fa-solid fa-xmark"></i>
          </span>
         <Link to= "/">
            <button className="btn">home</button>
            </Link>
          <Link to="/cursos">
            <button className="btn">cursos</button>
          </Link>
          <Link to="/sobremi">
            <button className="btn">sobreMi</button>
          </Link>
          <Link to="/contacto">
            <button className="btn">contacto</button>
          </Link>
        </div>
        <div>
          <span id="hamburguer">
            <i className="fa-solid fa-bars"></i>
          </span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
