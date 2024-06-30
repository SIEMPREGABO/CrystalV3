import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ScheduleComponent, Inject, Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { useProject } from '../context/projectContext';
import { Header } from '../components';
import swal from 'sweetalert';
import { useAuth } from "../context/authContext";

export const Config = () => {
  const { id } = useParams();
  const {
    fechasproject,
    fechasentregas,
    fechasiteraciones,
    configProyect,
    deleteProjectFunction,
    getProject,
    infoUpdateProject
  } = useProject();
  const { user } = useAuth();
  const [scheduleData, setScheduleData] = useState([]);
  const [projectName, setProjectName] = useState([]);
  const [projectDesc, setProjectDesc] = useState([]);
  const [projectObj, setProjectObj] = useState([]);
  const [projectSubject, setProjectSubject] = useState([]);

  const handleSaveChanges = async () => {
    const idnt = {
      ID: id,
      USER : user.ID
    }

    const proyecto = {
      ID_PROYECTO: fechasproject[0].ID,
      NOMBRE: projectName,
      OBJETIVO: projectObj,
      DESCRIPCION: projectDesc,
      MATERIA: projectSubject
    }
    await infoUpdateProject(proyecto);
    await configProyect(scheduleData);
    await getProject(idnt);
  };

  const handleDeleteProject = () => {
    //console.log(scheduleData)
    swal({
      title: "Eliminar proyecto",
      text: "¿Quieres eliminar el proyecto?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const data = {
            ID_PROYECTO: id
          }
          deleteProjectFunction(data);
        }
      });
  };

  useEffect(() => {
    setProjectName(fechasproject[0].NOMBRE);
    setProjectObj(fechasproject[0].OBJETIVO);
    setProjectDesc(fechasproject[0].DESCRIPCION_GNRL);
    setProjectSubject(fechasproject[0].MATERIA);
  }, [fechasproject]);

  useEffect(() => {
    let events = [];
    let contador = 0;
    fechasproject?.forEach(project => {
      contador++;
      events.push({
        Id: contador,
        Id_project: project.ID,
        State: project.ESTADO,
        Subject: `${project.NOMBRE}`,
        StartTime: new Date(project.FECHA_INICIO),
        EndTime: new Date(project.FECHA_TERMINO),
        IsAllDay: true
      });

    });


    fechasentregas?.forEach((entrega, index) => {
      contador++;
      events.push({
        Id: contador,
        Id_entrega: entrega.ID,
        Id_proyecto: entrega.ID_PROYECTO,
        State: entrega.ESTADO,
        Subject: `Entrega ${index + 1}`,
        StartTime: new Date(entrega.FECHA_INICIO),
        EndTime: new Date(entrega.FECHA_TERMINO),
        IsAllDay: true
      });
    });


    fechasiteraciones?.forEach((iteracionesPorEntrega, index) => {
      iteracionesPorEntrega.forEach((iteracion, subIndex) => {
        contador++;
        events.push({
          Id: contador,
          Id_iteracion: iteracion.ID,
          Id_entrega: iteracion.ID_ENTREGA,
          State: iteracion.ESTADO,
          Subject: `Iteración ${subIndex + 1} de Entrega ${index + 1}`,
          StartTime: new Date(iteracion.FECHA_INICIO),
          EndTime: new Date(iteracion.FECHA_TERMINO),
          IsAllDay: true
        });
      });
    });

    setScheduleData(events);
    //console.log(contador);

  }, [fechasproject, fechasentregas, fechasiteraciones]);

  return (
    <div className='m-5 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <div className="relative flex flex-col justify-center min-h-screen ">
      <div className=" p-6 m-7 bg-gray rounded-md  ring-indigo-600 ">
        <Header category="Page" title="Ajustes de Proyecto" />

      <form className="mt-6">
      <div className="mb-2">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                    Nombre del Proyecto <span className='text-sm font-semibold text-red-800'>*</span>
                  </label>
                  <input
                    type="text"
                    name="NOMBRE"
                    placeholder='Nombre de la tarea'
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                    defaultValue={fechasproject[0].NOMBRE}
                    onChange={(e) => {setProjectName(e.target.value);}}
                  />
      </div>
      <div className="mb-2">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                    Objetivo del Proyecto <span className='text-sm font-semibold text-red-800'>*</span>
                  </label>
                  <input
                    type="text"
                    name="NOMBRE"
                    placeholder='Nombre de la tarea'
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                    defaultValue={fechasproject[0].OBJETIVO}
                    onChange={(e) => setProjectObj(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                    Descripción del Proyecto <span className='text-sm font-semibold text-red-800'>*</span>
                  </label>
                  <input
                    type="text"
                    name="NOMBRE"
                    placeholder='Nombre de la tarea'
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                    defaultValue={fechasproject[0].DESCRIPCION_GNRL}
                    onChange={(e) => setProjectDesc(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                    Materia Objetivo del Proyecto <span className='text-sm font-semibold text-red-800'>*</span>
                  </label>
                  <input
                    type="text"
                    name="NOMBRE"
                    placeholder='Nombre de la tarea'
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                    defaultValue={fechasproject[0].MATERIA}
                    onChange={(e) => setProjectSubject(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                    Calendario del Proyecto <span className='text-sm font-semibold text-red-800'>*</span>
                  </label>
                </div>
      </form>

        <ScheduleComponent height="850px" width="auto" eventSettings={{ dataSource: scheduleData }}>
          <Inject services={[Day, Month, Agenda, Resize, DragAndDrop]} />
        </ScheduleComponent>




        {/* Botón para guardar los cambios */}
        <div className="row mt-6">
          <div className=" col">
            <button onClick={handleSaveChanges} className=" px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
              Guardar cambios
            </button>
          </div>

          <div className=" col">
            <button onClick={handleDeleteProject} className=" px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
              Eliminar proyecto
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Config;
