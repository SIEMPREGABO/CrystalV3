import React, { useState, useEffect } from "react";
import { useProject } from "../context/projectContext";
import { Header } from '../components';
import { useStateContext } from '../context/Provider.js';

const Entregas = () => {
    const [entregas, setEntregas] = useState([]);
    const [showIteraciones, setShowIteraciones] = useState({});
    const [showTareas, setShowTareas] = useState({});
    const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();
    const { getTasksProject, entregasproject, fechasproject } = useProject();

    const toggleIteraciones = (entregaId) => {
        setShowIteraciones({
            ...showIteraciones,
            [entregaId]: !showIteraciones[entregaId]
        });
    };

    const toggleTareas = (iteracionId) => {
        setShowTareas({
            ...showTareas,
            [iteracionId]: !showTareas[iteracionId]
        });
    };

    useEffect(() => {
        if (fechasproject.length > 0) {
            const project = {
                ID_PROYECTO: fechasproject[0].ID,
            }

            getTasksProject(project);
        }
    }, [fechasproject]);

    useEffect(() => {
        if (entregasproject !== undefined && entregasproject.length > 0) {
            setEntregas(entregasproject);
        }
        //console.log(JSON.parse(entregasproject[0].REQUERIMIENTOS));
    }, [entregasproject]);

    const obtenerClasexEstado = (estado) => {
        if (estado === "Finalizada") {
            return "bg-green-200"
        } else if (estado === "En desarrollo") {
            return "bg-yellow-200"
        } else {
            return "bg-purple-200"
        }
    }

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl e-kanbantooltiptemp">
            <Header category="App" title="Reporte de Entregas" />

            {entregas.map((entrega, index) => (
                <div key={entrega.ID} className="mb-3">
                    <div className="flex flex-column dropdown bg-gray-200" style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}>
                        <button
                            className="btn btn-link dropdown-toggle text-xl font-semibold"
                            style={{ width: "100%", border: "none", color: "black" }}
                            onClick={() => toggleIteraciones(entrega.ID)}
                        >
                            {`Entrega # ${index + 1}`}
                            <i className="bi bi-chevron-down"></i>
                        </button>
                        {showIteraciones[entrega.ID] && (
                            <div className="dropdown-menu show" style={{ width: "100%", boxShadow: "none", position: "relative", top: "1rem", backgroundColor: 'transparent' }}>
                                <div className="w-full h-fit flex justify-around items-center">
                                    <div><strong className="pr-1">Fecha de inicio:</strong>{entrega.FECHA_INICIO ? new Date(entrega.FECHA_INICIO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"}</div>
                                    <div><strong className="pr-1">Fecha de Termino:</strong>{entrega.FECHA_TERMINO ? new Date(entrega.FECHA_TERMINO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"}</div>
                                </div>
                                {/* Bootstrap Tabs */}
                                <ul className="nav nav-tabs border" id={`tabs-${entrega.ID}`} role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id={`iteraciones-tab-${entrega.ID}`} data-bs-toggle="tab" data-bs-target={`#iteraciones-${entrega.ID}`} type="button" role="tab" aria-controls={`iteraciones-${entrega.ID}`} aria-selected="true">Iteraciones</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id={`requerimientos-tab-${entrega.ID}`} data-bs-toggle="tab" data-bs-target={`#requerimientos-${entrega.ID}`} type="button" role="tab" aria-controls={`requerimientos-${entrega.ID}`} aria-selected="false">Requerimientos</button>
                                    </li>
                                </ul>
                                <div className="tab-content border p-3" id="myTabContent">
                                    <div className="tab-pane fade show active" id={`iteraciones-${entrega.ID}`} role="tabpanel" aria-labelledby={`iteraciones-tab-${entrega.ID}`}>
                                        {/* Iteraciones */}
                                        {(JSON.parse(entrega.ITERACIONES)).map((iteracion, index) => (
                                            <div key={iteracion.id} className="mb-1 bg-gray-200" style={{}}>
                                                <div className="dropdown" style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}>
                                                    <button
                                                        className="btn btn-link dropdown-toggle text-black text-lg font-medium"
                                                        style={{ width: "100%", border: "none" }}
                                                        onClick={() => toggleTareas(iteracion.id)}
                                                    >
                                                        {`ITERACIÓN # ${index + 1}`}
                                                        <i className="bi bi-chevron-down"></i>
                                                    </button>
                                                    {showTareas[iteracion.id] && iteracion.tareas &&  (
                                                        <div className="dropdown-menu show border-gray-600" style={{ width: "100%", boxShadow: "none", position: "relative", backgroundColor: 'transparent' }}>
                                                            <div className="w-full h-fit flex justify-around items-center mb-1">
                                                                <div><strong className="pr-1">Fecha de inicio:</strong>{iteracion.fechai ? new Date(iteracion.fechai).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"}</div>
                                                                <div><strong className="pr-1">Fecha de Termino:</strong>{iteracion.fechaf ? new Date(iteracion.fechaf).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"}</div>
                                                            </div>
                                                            {iteracion.tareas.length > 0 ? (
                                                                <div>
                                                                    <div className="w-full flex border-b px-2" style={{ backgroundColor: currentColor }}>
                                                                <div className="w-4/12 flex items-center justify-center text-white font-bold"><p>Tarea</p></div>
                                                                <div className="w-3/12 flex items-center justify-center text-white font-bold"><p>Desarrollador</p></div>
                                                                <div className="w-3/12 flex items-center justify-center text-white font-bold"><p>Estado de Desarrollo</p></div>
                                                                <div className="w-2/12 flex items-center justify-center text-white font-bold"><p>Fecha de Finalización</p></div>
                                                            </div>
                                                            {iteracion.tareas.map((tarea, index) => (
                                                                <div key={index} className="w-full flex border-b px-2 bg-white">
                                                                    <div className="w-4/12 flex items-center break-words">
                                                                        <strong>{tarea.nombre}</strong>
                                                                    </div>
                                                                    <div className="w-3/12 ">
                                                                        {tarea.devs.map((dev, devIndex) => (
                                                                            <div key={devIndex} className="w-full flex justify-center items-center">
                                                                                <p>{dev.nombredev}</p> <p className="text-sm ml-0.5 lowercase italic">{`(${(dev.rol)})`}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="w-3/12 flex justify-center items-center">
                                                                        <span>{tarea.est_desarr}</span>
                                                                    </div>
                                                                    <div className="w-2/12 flex justify-center items-center">
                                                                        <span className="flex justify-center ">{tarea.fechatermino ? new Date(tarea.fechatermino).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Aún sin terminar"}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                                </div>
                                                            ) : (<p className="mt-1 w-full text-lg text-center bg-transparent">No hay Tareas definidas para esta Iteración </p>)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="tab-pane fade bg-transparent" id={`requerimientos-${entrega.ID}`} role="tabpanel" aria-labelledby={`requerimientos-tab-${entrega.ID}`}>
                                    {entrega.REQUERIMIENTOS &&  JSON.parse(entrega.REQUERIMIENTOS) != null ? (
                                        <div>
                                             
                                        {/* Requerimientos */}
                                        <div className="w-full flex border-b px-2" style={{ backgroundColor: currentColor }}>
                                            <div className="w-5/12 flex items-center justify-center text-white font-bold"><p>Objetivo</p></div>
                                            <div className="w-5/12 flex items-center justify-center text-white font-bold"><p>Descripción</p></div>
                                            <div className="w-2/12 flex items-center justify-center text-white font-bold"><p>Tipo </p></div>
                                        </div>
                                        {JSON.parse(entrega.REQUERIMIENTOS).map((req, index) => (
                                            <div key={index} className="w-full flex border-b px-2 bg-white">
                                                <div className="w-5/12 flex items-center break-words p-1">
                                                    <strong>{req.objetivo}</strong>
                                                </div>
                                                <div className="w-5/12 flex items-center break-words p-1">
                                                    <p>{req.descripcion}</p>
                                                </div>
                                                <div className="w-2/12 flex justify-center items-center break-words p-1">
                                                    <p className="text-center">{req.treq}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    ) : (<p className="mt-1 w-full text-lg text-center bg-transparent">No hay Requerimientos definidos para esta Entrega</p>)}
                                        </div>
                                </div>
                                {/* Fin Bootstrap Tabs */}
                            </div>
                        )}
                    </div>
                </div>
            ))}

        </div>
    );
}

export default Entregas;