import React, { useState } from "react";
import { useProject } from "../context/projectContext";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
const Entregas = () => {
    
    
    const [entregas, setEntregas] = useState([]);
    const [showIteraciones, setShowIteraciones] = useState({});
    const [showTareas, setShowTareas] = useState({});

    const {getTasksProject, entregasproject, fechasproject} = useProject();

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
        if(fechasproject.length > 0){
        const project = {
            ID_PROYECTO: fechasproject[0].ID,
        }

        getTasksProject(project);
        //setEntregas(entregasproject);
    }
        //setEntregas(entregasp.data);
        //console.log(entregas);
    }, [fechasproject]);

    useEffect(() => {
        if(entregasproject !== undefined && entregasproject.length > 0){
        setEntregas(entregasproject);
        setShowIteraciones((JSON.parse(entregasproject[0].ITERACIONES)));
        console.log((JSON.parse(entregasproject[0].ITERACIONES))[0].tareas)
        }
    }, [entregasproject]);

    useEffect(() => {
        if(entregas !== undefined && entregas.length > 0){
            //console.log(entregas[0]);
        }
    }, [entregas]);

    const obtenerClasexEstado = (estado) => {
        if(estado === "Finalizada"){
            return "bg-green-200"
        }else if(estado === "En desarrollo"){
            return "bg-yellow-200"
        }else{
            return "bg-purple-200"
        }
    }


    return (
        <div className="container">
            <h1 style={{ color: "black" }}>Proyecto</h1>
            {entregas.map((entrega, index) => (
                <div key={entrega.ID} className="mb-3">
                    <div className="dropdown bg-gray-200" style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}>
                        <button
                            className="btn btn-link dropdown-toggle"
                            style={{ width: "100%", border: "none", color: "black" }}
                            onClick={() => toggleIteraciones(entrega.ID)}
                        >
                            {`Entrega # ${index+1}`}
                            <i className="bi bi-chevron-down"></i>
                        </button>
                        {showIteraciones[entrega.ID] && (
                            <div className="dropdown-menu show" style={{ width: "100%", boxShadow: "none", position: "relative", top: "1rem" }}>
                                {(JSON.parse(entrega.ITERACIONES)).map((iteracion, index) => (
                                    <div key={iteracion.id} className="mb-3 bg-blue-200">
                                        <div className="dropdown" style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}>
                                            <button
                                                className="btn btn-link dropdown-toggle"
                                                style={{ width: "100%", border: "none", color: "black" }}
                                                onClick={() => toggleTareas(iteracion.id)}
                                            >
                                                {`ITERACION # ${index+1}`}
                                                <i className="bi bi-chevron-down"></i>
                                            </button>
                                            {showTareas[iteracion.id] && iteracion.tareas && (
                                                <div className="dropdown-menu show border-gray-600" style={{ width: "100%", boxShadow: "none", position: "relative", top: "1rem" }}>
                                                    {iteracion.tareas.map((tarea, index) => (
                                                        
                                                        <div key={index} className={`mb-3 d-flex justify-around align-center py-1 pe-2 ps-2 ${obtenerClasexEstado(tarea.est_desarr)}`} style={{borderBottom: "2px solid black"}}>
                                                            <div className="d-flex justify-around align-center">
                                                                <strong>{tarea.nombre}</strong>: {tarea.est_desarr}
                                                            </div>
                                                            <div className="d-flex justify-around align-center">
                                                                <button className="btn btn-primary btn-sm me-1 ">Actualizar</button>
                                                                <button className="btn btn-danger btn-sm">Eliminar</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
  
}

export default Entregas;