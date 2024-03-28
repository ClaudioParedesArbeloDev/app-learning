//Modulos
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination } from './pagination';
import { PostPage } from './postPage';
import { CurrentURL } from '../../api/url';


//Estilos
import './listado.css';

// Definición del componente Listado
const Listado = () => {
  
  const [dataQt, setDataQt] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState ([])
    
  // Método que se ejecuta cuando el componente se monta en el DOM
  useEffect(() => {
    // Realizar una solicitud GET a la API para obtener la lista de usuarios
    axios.get(`${CurrentURL}/api/users`)
      .then(response => {
        // Actualizar el estado del componente con los usuarios obtenidos de la API
        console.log(response.data)
        setUsers(response.data );
      })
      .catch(error => {
        // Manejar errores si ocurre algún problema al obtener los usuarios
        console.error('Error al obtener usuarios:', error);
      });
  }, [])

  const indexFin = currentPage * dataQt;
  const indexInicio = indexFin - dataQt;

  const nData = users.slice(indexInicio, indexFin);
  const nPages = Math.ceil(users.length / dataQt);
  // Método para renderizar el contenido del componente
  return (  
      <div className="listadoWrapper">
        <h2>Listado alumnos</h2>
        <PostPage setDataQt={setDataQt} />
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
            {nData.map((user) => (
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
          <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} nPages={nPages}/>
        </div>
      </div>
    );
  }


export default Listado;