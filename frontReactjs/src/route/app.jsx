//Modulos
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

//Componentes
import Navbar from '../component/navbar/Navbar'
import Footer from '../component/footer/Footer'
import Sidebar from '../component/sidebar/sidebar';
import Home from '../component/home/home'
import SobreMi from '../component/sobremi/sobremi';
import Contacto from '../component/contacto/contacto';
import Cursos from '../component/cursos/cursos';
import Registro from '../component/registro/registro';
import SucessReg from '../component/sucessReg/sucessReg';
import Listado from '../component/listado/listado'
import FichaIndividual from '../component/fichaind/fichaind';
import Plataforma from '../component/plataforma/plataforma';
import ProtectedRoute from './ProtectedRoute';


//Estilos
import './app.css';

// Layout para componentes con Navbar y Footer
const Layout = ({ children }) => (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
  
  // Layout para componentes de la plataforma con Sidebar
  const PlatformLayout = ({ children }) => (
    <div>
      <Sidebar/>
      {children}
    </div>);
  
// Componente principal de la aplicación
const App = () => {
    return (
     
      <div>
        <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/" element={<Layout><Home /></Layout>
              }
            />
            <Route
              path="/contacto"
              element={<Layout><Contacto /></Layout>}
            />
            <Route
              path="/sobremi"
              element={<Layout><SobreMi /></Layout>}
            />
            <Route
              path="/cursos"
              element={<Layout><Cursos /></Layout>}
            />
            <Route
              path="/registro"
              element={<Layout><Registro /></Layout>}
            />
            <Route
              path="/sucessreg"
              element={<Layout><SucessReg /></Layout>}
            />

            <Route element={<ProtectedRoute/>}>
              <Route
                path="/listado"
                element={<Layout><Listado /></Layout>}
              />
              <Route
                path="/fichaindividual/:dni"
                element={<Layout><FichaIndividual /></Layout>}
              />
            
              <Route
                path="/plataforma"
                element={
                <PlatformLayout><Plataforma /></PlatformLayout>}
              />
            </Route>
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </div>
      
    );
  };
  
  export default App;