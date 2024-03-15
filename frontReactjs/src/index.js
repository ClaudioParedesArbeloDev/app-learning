//Modulos
import React from 'react';
import ReactDOM from 'react-dom/client';


//Estilo
import './index.css';

//Modulo
import App from './route/app';

// Importar la función para reportar las métricas web
import reportWebVitals from './reportWebVitals';

// Crear una raíz de renderizado para la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación en la raíz de renderizado
root.render(
  <React.StrictMode>
      
      <App/>
      
  </React.StrictMode>
);

// Reportar las métricas web
reportWebVitals();
