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
    getProject
  } = useProject();
  const { user } = useAuth();
  const [scheduleData, setScheduleData] = useState([]);


  const handleSaveChanges = async () => {
    const idnt = {
      ID: id,
      USER: user.ID
    }
    await configProyect(scheduleData);
    await getProject(idnt);
  };

  const handleDeleteProject = () => {
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

  }, [fechasproject, fechasentregas, fechasiteraciones]);

  return (
    <div className="relative flex flex-col justify-center min-h-screen ">
      <div className=" p-6 m-7 bg-gray rounded-md  ring-indigo-600 ">
        <h1 className="text-3xl pb-3  font-semibold text-center text-indigo-700 underline uppercase">
          Ajustes del proyecto
        </h1>


        <ScheduleComponent height="850px" width="1700px" eventSettings={{ dataSource: scheduleData }}>
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


  );
};

export default Config;
