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
import Perfil from '../component/perfil/perfil';
import Desarrolloweb from '../component/desarrolloweb/desarrolloweb';
import Javascript from '../component/javascript/javascript';
import Reactjs from '../component/reactjs/reactjs';
import ChatComponent from '../component/chat/chat';
import Clases from '../component/clases/clases';
import ResPassword from '../component/resPassword/respassword';
import ProtectedRoute from './ProtectedRoute';
import Contrasena from '../component/contrasena/contrasena';
import ResetPassword from '../component/resetpassword/resetpassword';

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
      <Sidebar>
      {children}
      </Sidebar>
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
              path="/respassword"
              element={<Layout><ResPassword /></Layout>}
            />
            <Route
              path="/resetpassword/:token"
              element={<Layout><ResetPassword  /></Layout>}
            />
            <Route
              path="/sucessreg"
              element={<Layout><SucessReg /></Layout>}
            />
            <Route
              path="/contrasena"
              element={<Layout><Contrasena /></Layout>}
            />

            <Route element={<ProtectedRoute/>}>
              <Route
                path="/listado"
                element={<Layout><Listado/></Layout>}
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
              <Route
                path="/perfil"
                element={
                <PlatformLayout><Perfil /></PlatformLayout>}
              />
              <Route
                path="/chat"
                element={
                <PlatformLayout><ChatComponent /></PlatformLayout>}
              />
              <Route
                path="/plataforma/Desarrollo Web"
                element={
                <PlatformLayout><Desarrolloweb /></PlatformLayout>}
              />
              <Route
                path="/plataforma/JavaScript"
                element={
                <PlatformLayout><Javascript /></PlatformLayout>}
              />
              <Route
                path="/plataforma/ReactJs"
                element={
                <PlatformLayout><Reactjs /></PlatformLayout>}
              />
              <Route
                path="/plataforma/clases"
                element={
                <PlatformLayout><Clases /></PlatformLayout>}
              />
            </Route>
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </div>
      
    );
  };
  
  export default App;


 