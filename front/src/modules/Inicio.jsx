import React, { useState } from 'react';
import { useEffect } from "react";
import { useAuth } from '../context/authContext';
import moment from "moment";
import { Chart } from "react-google-charts";
import { cartData, earningData } from '../data/dummy';
import { useStateContext } from '../context/Provider';
import { Button } from '../components';
import { useProject } from "../context/projectContext";
import { BsBoxSeam } from 'react-icons/bs';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { FiBarChart } from 'react-icons/fi';
import { HiOutlineRefresh } from 'react-icons/hi';
{/* el data es para los datos de la grafica y el option pues basicamente para el estilo de la grafica*/ }

const data = [
  ["Task", "Hours per Day"],
  ["Work", 11],
  ["Eat", 2],
  ["Commute", 2],
  ["Watch TV", 2],
  ["Sleep", 7],
];

const options = {
  title: "",
  is3D: true,

  titleTextStyle: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center'
  },
  chartArea: {
    width: '100%',
    height: '80%',
  },
  legend: {
    textStyle: {
      fontSize: 14,
      color: '#666',
    },
    position: 'bottom',
    alignment: 'center',
  },
};
const Inicio = () => {
  const { currentColor } = useStateContext();
  const { getProject, project, fechasproject, participants, projectInfo } = useProject();
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

      const datac = [
        ["Tareas", "Estado"],
        ["En espera", (projectInfo[0].NUMTAREASESP > 0 ? projectInfo[0].NUMTAREASESP : 0)],
        ["En desarrollo", (projectInfo[0].NUMTAREASDES > 0 ? projectInfo[0].NUMTAREASDES : 0)],
        ["Por Revisar", (projectInfo[0].NUMTAREASREV > 0 ? projectInfo[0].NUMTAREASREV : 0)],
        ["Completadas", (projectInfo[0].NUMTAREASCMP > 0 ? projectInfo[0].NUMTAREASCMP : 0)]
      ];

      setDataChart(datac);
      setEarningData(carddata);
    }
  }, [projectInfo]);

  useEffect(() => {
    console.log(fechasproject);
    console.log(projectInfo);
  }, [fechasproject]);



  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full h-auto lg:w-80 p-8 pt-9 m-3 bg-gradient-to-r from-cyan-500 to-blue-500 bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className='font-bold text-gray-700'>{fechasproject && fechasproject.length > 0 ? `Proyecto: ${fechasproject[0].NOMBRE}` : 'Cargando...'}</p>
              <p className='text-2xl'>{fechasproject && fechasproject.length > 0 ? `Objetivo:  ${fechasproject[0].OBJETIVO}` : 'Cargando...'}
                {/* aca deberia de mostrarse aparte de los ID, el nombre del proyecto, la descripcion ya */}
              </p>
              <p className='text-xl'>Color Crystal: {fechasproject && fechasproject.length > 0 ? (fechasproject[0].ID_CATEGORIA_CRYSTAL == 1 ? 'Clear' : 'other') : 'Cargando...'}</p>
            </div>
          </div>
          <div className='mt-6'>
            <Button color="black" bgColor={currentColor} text="Download" borderRadius="10px" size="md" />
          </div>
        </div>
        <div className='flex m-3 flex-wrap justify-center gap-1 items-center'>
          {/* este map recorre el grid que tengo en el data yummi, ahi podris modificar las consultas o traer directamente el lo del data yummi y tomar solo los iconos e insertar lo de las consulta, para que mues
        muestre las entregas, los participantes, la itercion y ya*/}
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
        <div className='mt-3 flex-gap w-800  justify-center flex flex-wrap items-center'>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg w-800" style={{ textAlign: 'center', fontSize: '20px', color: '#333' }} >
            Estado General de Tareas
          </div>
          {/* aca basicamente es el uso del componente de graficas we, tienes que instalar la dependencia que basicamente es esta
  npm install --save react-google-charts */}
          <Chart
            chartType="PieChart"
            data={dataChart}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </div>
      </div>
    </div>
  );
}

export default Inicio;