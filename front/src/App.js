import Home from './modules/Home.jsx';
import Login from './modules/Login.jsx';
import Register from './modules/Register.jsx';
import { Routes, Route } from 'react-router-dom';
import Panel from './modules/Panel.jsx';
import Reset from './modules/Reset.jsx';
import ResetPass from './modules/ResetPass.jsx';
import './/css/App.css';
import { AuthProvider } from './context/authContext.js';
import ProtectedRoute from './ProtectedRoute';
import Footer from "./modules/Footer.jsx";
import Proyecto from "./modules/Proyect.jsx";
import FormProyect from './modules/FormProyect.jsx';
import ConfigProfile from './modules/ConfigProfile.jsx';
import { ProjectProvider } from './context/projectContext.js';
import { ContextProvider } from "./context/Provider";

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
      <ContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path='/reset' element={<Reset />} />
          <Route path='/resetpass/:token' element={<ResetPass />} />
          <Route element={<ProtectedRoute />}>

            <Route path="/panel" element={<Panel />} />
            <Route path="/configurar-proyecto" element={<FormProyect />} />
            <Route path="/configurar-perfil" element={<ConfigProfile />} />
            <Route path="/Proyecto/:id/*" element={<Proyecto/>}>
              <Route index element={<Proyecto />} />
            </Route>
          </Route>
        </Routes>
        <Footer />
        </ContextProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}



export default App;