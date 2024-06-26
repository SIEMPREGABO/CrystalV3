import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Participantes from "./Usuario.jsx";
import ChatIteracion from "./ChatIteracion.jsx";
import Configuracion from "./Config.jsx"
import Calendario from "./Calendario.jsx";
import AsignarTarea from "./AsignarTarea.jsx";
import Dashboard from "./Inicio.jsx";
import Entregas from "./Entregas.js";
import Kanban from "./Kanban.jsx";
import RequerimientoVoz from "./RequerimientosVoz.jsx";
import Requerimientos from "./Requerimientos.jsx";
import VideoChat from "./VideoChat.jsx";
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Sidebar, ThemeSettings, Navbar } from "../components/index.jsx";
import { useProject } from "../context/projectContext.js";
import { useStateContext } from '../context/Provider.js';
import ProtectProject from './ProtectProject.jsx';
import { useAuth } from "../context/authContext.js";
import Footer from "../components/Footer.jsx";

export const Proyecto = () => {
    const { id } = useParams();
    const idint = parseInt(id, 10).toString();
    const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();
    const { user } = useAuth();
    const { getPermissions, userRole } = useProject();

    const navigate = useNavigate();

    useEffect(() => {

        const data = {
            ID: idint,
            USER: user.ID
        }
        getPermissions(data);
        console.log(userRole);
    }, [userRole]);

    return (
        <div className='bg-light-gray'>
            <div className="flex relative bg-light-gray ">
                <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                    <TooltipComponent content="Settings" position="Top">
                        <button
                            type="button"
                            className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                            onClick={() => setthemeSettings(true)}
                            style={{ background: currentColor, borderRadius: '50%' }}
                        >
                            <FiSettings />
                        </button>
                    </TooltipComponent>
                </div>

                {activeMenu ? (
                    <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                        <Sidebar />
                    </div>
                ) : (
                    <div className="w-0 dark:secondary-dark-bg">
                        <Sidebar />
                    </div>
                )}

                <div
                    className={
                        activeMenu
                            ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                            : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
                    }
                >
                    <Navbar />

                    <div>
                        <Routes>
                            <Route element={<ProtectProject />}>
                                {themeSettings && <ThemeSettings />}
                                {/* Proteger las rutas autorizadas */}
                                {userRole && <Route path="Home" element={<Dashboard />} />}
                                {userRole && <Route path="Participantes" element={<Participantes />} />}
                                {userRole && <Route path="Asignar-tarea" element={<AsignarTarea />} />}
                                {userRole && <Route path="Calendario" element={<Calendario />} />}
                                {userRole && <Route path="ChatIteracion" element={<ChatIteracion />} />}
                                {userRole && <Route path="Informes" element={<Entregas />} />}
                                {userRole && <Route path="Configuracion" element={<Configuracion />} />}
                                {userRole && <Route path="Kanban" element={<Kanban />} />}
                                {userRole && <Route path="VideoChat" element={<VideoChat />} />}
                                {userRole && <Route path="Requerimientos-x-voz" element={<RequerimientoVoz />} />}
                                {userRole && <Route path="Requerimientos" element={<Requerimientos />} />}


                                {!userRole && <Route path="Home" element={<Dashboard />} />}
                                {!userRole && <Route path="Calendario" element={<Calendario />} />}
                                {!userRole && <Route path="ChatIteracion" element={<ChatIteracion />} />}
                                {!userRole && <Route path="Kanban" element={<Kanban />} />}
                                {!userRole && <Route path="VideoChat" element={<VideoChat />} />}
                            </Route>
                        </Routes>
                    </div>

                </div>
            </div>
            <div className='bg-light-gray'>
                <Footer />
            </div>
        </div>
    );
}

export default Proyecto;