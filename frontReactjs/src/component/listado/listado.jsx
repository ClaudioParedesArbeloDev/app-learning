//Modulos
import React, { Component } from 'react';
import axios from 'axios';

//Estilos
import './listado.css';

// Definición del componente Listado
class Listado extends Component {
  constructor(props) {
    super(props);
    // Estado inicial del componente
    this.state = {
      users: []// Array para almacenar los usuarios obtenidos de la API
    };
  }

  // Método que se ejecuta cuando el componente se monta en el DOM
  componentDidMount() {
    // Realizar una solicitud GET a la API para obtener la lista de usuarios
    axios.get('http://localhost:8000/api/users')
      .then(response => {
         // Actualizar el estado del componente con los usuarios obtenidos de la API
        this.setState({ users: response.data });
      })
      .catch(error => {
        // Manejar errores si ocurre algún problema al obtener los usuarios
        console.error('Error al obtener usuarios:', error);
      });
  }
  // Método para renderizar el contenido del componente
  render() {
    return (
      <div className="listadoWrapper">
        <h2>Listado alumnos</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Documento</th>
                <th>Fecha de Nacimiento</th>
                <th>Domicilio</th>
                <th>Celular</th>
                <th>e-mail</th>
                <th>Ficha</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map(user => (
                <tr key={user.dni}>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.dni}</td>
                  <td>{user.fechaNacimiento}</td>
                  <td>{user.domicilio}</td>
                  <td>{user.celular}</td>
                  <td>{user.email}</td>
                  <td><button id="ficha"><a href={`/fichaindividual/${user.dni}`}>Ver Ficha</a></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Listado;