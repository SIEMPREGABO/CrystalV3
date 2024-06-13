import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { FcMediumPriority, FcLowPriority, FcHighPriority } from "react-icons/fc";
import { Button } from '.';
import { chatData } from '../data/dummy';
import { useStateContext } from '../context/Provider';
import { useProject } from '../context/projectContext';
import moment from "moment";
import { useAuth } from '../context/authContext';

const Notification = () => {
  const { currentColor } = useStateContext();
  const { notificaciones, setNotificaciones, changeState } = useAuth();

  const formatFechaEnvio = (fechaEnvio) => {
    //const date = new Date(fechaEnvio);
    const fecha = moment.utc(fechaEnvio).format('DD-MM-YYYY HH:mm:ss');
    return fecha;
  }

  
  useEffect(()=>{
    notificaciones?.map((notificacion)=>{
      notificacion.ESTADO_VISUALIZACION=1;
    });
    setNotificaciones(notificaciones);
    changeState(notificaciones);
  },[notificaciones])

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Notificaciones</p>
          {/*contadorNotificaciones > 0 ? <div className="text-white text-xs rounded p-1 px-2 bg-orange-500 "> {contadorNotificaciones}</div> : [] */}

        </div>
      </div>
      <div className="mt-2 ">
        {notificaciones.length === 0 ? (
          <div className="flex items-center leading-8 gap-5 border-b-1 border-color p-3">
            <p className="font-semibold dark:text-gray-200">No hay mensajes</p>
          </div>
        ) : (
          notificaciones.map((item, index) => (
            <div key={index} className="flex items-center leading-8 gap-5 border-b-1 border-color p-3">
              {item.PRIORIDAD === 'Alta' && <FcHighPriority size={64}/>}
              {item.PRIORIDAD === 'Media' && <FcMediumPriority size={64}/>}
              {item.PRIORIDAD === 'Baja' && <FcLowPriority size={64}/>}
              <div>
                <p className="font-semibold dark:text-gray-200">{item.CONTENIDO}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400"> {formatFechaEnvio(item.FECHA_ENVIO)} </p>
              </div>
            </div>
          ))
        )
        }


      </div>
    </div>
  );
};

export default Notification;