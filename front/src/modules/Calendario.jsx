import React, { useEffect, useState } from 'react'
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
//import { scheduleData } from '../data/dummy';
import { Header } from '../components';
import { useProject } from '../context/projectContext';
import { useParams } from 'react-router-dom';

const Calendario = () => {
  const {
    fechasproject,
    fechasentregas,
    fechasiteraciones
  } = useProject();
  const [scheduleData, setScheduleData] = useState([]);


  useEffect(() => {
    let events = [];
    let contador = 0;
    fechasproject?.forEach(project => {
      contador++;
      events.push({
        Id: contador,
        Subject: `Proyecto: ${project.NOMBRE}`,
        StartTime: new Date(project.FECHA_INICIO),
        EndTime: new Date(project.FECHA_TERMINO),
        IsAllDay: true
      });

    });


    fechasentregas?.forEach((entrega, index) => {
      contador++;
      events.push({
        Id: contador,
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
      <div className="w-full p-6 m-7 bg-gray rounded-md ring-indigo-600 ">
        <Header title="Calendario" />
        
        <ScheduleComponent height="850px" readonly={true}  eventSettings={{ dataSource: scheduleData }}>
          <Inject services={[Day, Month, Agenda, Resize, DragAndDrop]} />
        </ScheduleComponent>
      </div>
    </div>
  )
}

export default Calendario;
