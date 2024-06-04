import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { Chart } from "react-google-charts";
import { useStateContext } from '../context/Provider';
import { Button } from '../components';
import  PDF  from "../components/PDF.jsx";
import {PDFDownloadLink} from "@react-pdf/renderer";
import { useProject } from "../context/projectContext";
import { BsBoxSeam } from 'react-icons/bs';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { FiBarChart } from 'react-icons/fi';
import { HiOutlineRefresh } from 'react-icons/hi';
import '../css/kanban.module.css';

const options = {
  gantt: {
    criticalPathEnabled: false,
    criticalPathStyle: {
      stroke: '#e64a19',
      strokeWidth: 5,
    },
    trackHeight: 30,
    labelStyle: {
      fontName: 'Arial',
      fontSize: 12,
      color: '#757575',
    },
  },
  chartArea: {
    left: 200,
    width: '100%',
  },
  tooltip: { isHtml: true }, // Ensure HTML tooltips are enabled
};

const Inicio = () => {
  const { currentColor } = useStateContext();
  const [entregas, setEntregas] = useState([]);
  const { getProject, project, fechasproject, participants, projectInfo, tareasGantt, entregasproject, getTasksProject } = useProject();
  const [earningData, setEarningData] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (projectInfo && projectInfo.length > 0) {
      const carddata = [
        {
          icon: <MdOutlineSupervisorAccount />,
          amount: projectInfo[0].NUMPARTICIPANTS,
          percentage: '',
          title: 'Participantes',
          iconColor: '#03C9D7',
          iconBg: '#E5FAFB',
          pcColor: 'red-600',
        },
        {
          icon: <BsBoxSeam />,
          amount: projectInfo[0].NUMENTREGAS,
          percentage: `${Math.floor((projectInfo[0].NUMENTREGASCMP * 100) / projectInfo[0].NUMENTREGAS)} % completado`,
          title: 'Entregas',
          iconColor: 'rgb(255, 244, 229)',
          iconBg: 'rgb(254, 201, 15)',
          pcColor: 'green-600',
        },
        {
          icon: <HiOutlineRefresh />,
          amount: projectInfo[0].NUMITERACIONES,
          percentage: `${Math.floor((projectInfo[0].NUMITERACIONESCMP * 100) / projectInfo[0].NUMITERACIONES)} % completado`,
          title: 'Iteraciones',
          iconColor: 'rgb(0, 194, 146)',
          iconBg: 'rgb(235, 250, 242)',
          pcColor: 'red-600',
        },
        {
          icon: <FiBarChart />,
          amount: projectInfo[0].NUMTAREAS,
          percentage: `${Math.floor((projectInfo[0].NUMTAREASCMP * 100) / projectInfo[0].NUMTAREAS)} % completado`,
          title: 'Tareas',
          iconColor: 'rgb(228, 106, 118)',
          iconBg: 'rgb(255, 244, 229)',
          pcColor: 'green-600',
        },
      ];

      setEarningData(carddata);
    }
  }, [projectInfo]);

  useEffect(() => {
    if(fechasproject.length > 0){
      const project = {
          ID_PROYECTO: fechasproject[0].ID,
      }

      getTasksProject(project);
      //setEntregas(entregasproject);
  }
  }, [fechasproject]);

  useEffect(() => {
    if(entregasproject !== undefined && entregasproject.length > 0){
        setEntregas(entregasproject);
        //setShowIteraciones((JSON.parse(entregasproject[0].ITERACIONES)));
        console.log(entregasproject);
        
        }
  }, [entregasproject]);

  useEffect(() => {
    if (tareasGantt && tareasGantt.length > 0) {
      const columnsGantt = [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "string", label: "Resource" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" },
        { type: "string", role: "tooltip", p: { html: true } } // Add tooltip column
      ];

      const rows = [];

      tareasGantt.forEach((tarea, index) => {
        let percent = 0;

        switch (tarea.ESTADO_DESARROLLO) {
          case "En espera":
            percent = 0;
            break;
          case "En desarrollo":
          case "Atrasada":
            percent = 40;
            break;
          case "Por Revisar":
            percent = 75;
            break;
          case "Cerrada":
            percent = 100;
            break;
          default:
            break;
        }

        const taskId = `Tarea ${tarea.ID}: ${tarea.NOMBRE}`;
        const taskName = `Tarea ${tarea.ID}: ${tarea.NOMBRE}`;

        const tooltipContent = `
          <div style="padding:10px;">
            <h4>${taskName}</h4>
            <p><strong>Inicio:</strong> ${new Date(tarea.FECHA_INICIO).toLocaleDateString()}</p>
            <p><strong>Fin:</strong> ${new Date(tarea.FECHA_MAX_TERMINO).toLocaleDateString()}</p>
            <p><strong>Porcentaje Completado:</strong> ${percent}%</p>
            <p><strong>Entrega:</strong> ${tarea.ENTREGA}</p>
          </div>
        `;
        let arrayDependencias =[];
        
        let dependencies = "";
if (tarea.DEPENDENCIAS) {
    let arrayDependencias = tarea.DEPENDENCIAS.split(",");
    //console.log(arrayDependencias);
    
    arrayDependencias.map((dependencia, index) => {
        let startIndex = 0;
        let foundIndex = -1;
        
        // Seguimos buscando hasta encontrar un índice válido
        while (true) {
            foundIndex = tareasGantt.findIndex((element, idx) => idx >= startIndex && typeof element.NOMBRE === 'string' && element.NOMBRE.includes(dependencia));
            
            if (foundIndex > -1) {
                startIndex = foundIndex + 1; // Actualizamos startIndex para la siguiente búsqueda
                break; // Salimos del bucle while si encontramos un índice válido
            } else {
                break; // Salimos del bucle while si no encontramos más coincidencias
            }
        }
        
        //console.log(foundIndex);
        if (foundIndex > -1) {
            if (index < arrayDependencias.length - 1) {
                dependencies += `Tarea ${tareasGantt[foundIndex].ID}: ${tareasGantt[foundIndex].NOMBRE},`;
            } else {
                dependencies += `Tarea ${tareasGantt[foundIndex].ID}: ${tareasGantt[foundIndex].NOMBRE}`;
            }
        }
        //console.log(dependencies);
    });
}
        
        //console.log(dependencies);
        //
        //console.log(arrayDependencias);
        rows.push([
          taskId,
          taskName,
          tarea.ENTREGA,
          new Date(tarea.FECHA_INICIO),
          new Date(tarea.FECHA_MAX_TERMINO),
          null,
          percent,
          dependencies,
          tooltipContent // Add tooltip content
        ]);
      });

      const data = [columnsGantt, ...rows];
      setDataChart(data);
      //console.log(tareasGantt);
    }
  }, [tareasGantt]);

  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full h-auto lg:w-80 p-8 pt-9 m-3 bg-gradient-to-r from-cyan-500 to-blue-500 bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className='font-bold text-gray-700'>{fechasproject && fechasproject.length > 0 ? `Proyecto: ${fechasproject[0].NOMBRE}` : 'Cargando...'}</p>
              <p className='text-2xl'>{fechasproject && fechasproject.length > 0 ? `Objetivo:  ${fechasproject[0].OBJETIVO}` : 'Cargando...'}</p>
              <p className='text-xl'>Color Crystal: {fechasproject && fechasproject.length > 0 ? (fechasproject[0].ID_CATEGORIA_CRYSTAL == 1 ? 'Clear' : 'other') : 'Cargando...'}</p>
            </div>
          </div>
          <div className='mt-6'>
          <PDFDownloadLink document={<PDF project={fechasproject && fechasproject.length > 0 ? fechasproject[0].NOMBRE : 'Cargando...'} descproject={fechasproject && fechasproject.length > 0 ? fechasproject[0].OBJETIVO : 'Cargando...'} fcreate={fechasproject && fechasproject.length > 0 ? fechasproject[0].FECHA_CREACION : 'Cargando...'} finicio={fechasproject && fechasproject.length > 0 ? fechasproject[0].FECHA_INICIO : 'Cargando...'} ftermino={fechasproject && fechasproject.length > 0 ? fechasproject[0].FECHA_TERMINO : 'Cargando...'} eterm={projectInfo && projectInfo.length > 0 ? projectInfo[0].NUMENTREGASCMP : 'Cargando...'} iterm={projectInfo && projectInfo.length > 0 ? projectInfo[0].NUMITERACIONESCMP : 'Cargando...'} taskterm={projectInfo && projectInfo.length > 0 ? projectInfo[0].NUMTAREASCMP : 'Cargando...'} taskData={entregas}/>} fileName="myFirstPDF.pdf">
                {
                    ({loading, url, error, blob}) => 
                        loading ? (
                            <Button color="black" bgColor={currentColor} text="Loading Doc ..." borderRadius="10px" size="md" />
                        ) : (
                            <Button color="black" bgColor={currentColor} text="Download" borderRadius="10px" size="md" />
                        )
                }
            </PDFDownloadLink>
            
          </div>
        </div>
        <div className='flex m-3 flex-wrap justify-center gap-1 items-center'>
          {earningData.map((item) => (
            <div key={item.title} className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md=:w-56 p-4 pt-9 rounded-2xl justify-center'>
              <button type='button' style={{ color: item.iconColor, backgroundColor: item.iconBg }} className='text -2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl'>
                {item.icon}
              </button>
              <p className='mt-3 text-center'>
                <span className='text-lg font-semibold'>
                  {item.amount}
                </span>
              </p>
              <p className='text-center'>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className='text-sm text-gray-400 mt-1 text-center'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex gap-10 flex-wrap justify-center'>
        <div className='mt-3 flex-gap w-1000 justify-center flex flex-wrap items-center'>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg w-1000" style={{ textAlign: 'center', fontSize: '20px', color: '#333' }}>
            Estado General de Tareas
          </div>
          <div style={{ overflowX: 'scroll', overflowY: 'scroll', height: '600px', width: '100%', scrollbarGutter: 'stable'}}>
            <Chart
              chartType="Gantt"
              data={dataChart}
              options={options}
              width={"150%"}
              height={"150%"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;