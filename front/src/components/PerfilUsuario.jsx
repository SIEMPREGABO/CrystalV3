import React, { useEffect } from 'react';
import { Button } from '.';
import { BsCurrencyDollar } from 'react-icons/bs';
import { FiCreditCard } from 'react-icons/fi';
import { BsShield } from 'react-icons/bs';

import { useStateContext } from '../context/Provider';

import { useAuth } from '../context/authContext';
import { useProject } from '../context/projectContext';
import { Link, useParams } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';

const PerfilUsuario = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { userRole } = useProject();
  const { currentColor } = useStateContext();
  const { logout } = useAuth();
  const { vaciarProject } = useProject();



  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Perfil de Usuario</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-2 border-color border-b-1 pb-6">

        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {user.NOMBRE_PILA} {user.APELLIDO_PATERNO} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  {userRole && <div>Administrador</div>}{!userRole && <div>Participante</div>}  </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {user.CORREO} </p>
        </div>
      </div>

      <div>
        <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
          <Link
            to={`/configurar-perfil`}
            style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
            className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            onClick={() => { vaciarProject(); }}>
            <BsCurrencyDollar />
          </Link>

          <div>
            <p className="font-semibold dark:text-gray-200 ">Configurar Perfil</p>
            <p className="text-gray-500 text-sm dark:text-gray-400"> Configuración de tu cuenta  </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
          <Link
            to={`/panel`}
            style={{ color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)' }}
            className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            onClick={() => { vaciarProject(); }}
          >
            <FiCreditCard />
          </Link>

          <div>
            <p className="font-semibold dark:text-gray-200 ">Panel</p>
            <p className="text-gray-500 text-sm dark:text-gray-400">Proyectos del usuario</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
          <Link
            to={`/Proyecto/${id}/Kanban`}
            style={{ color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)' }}
            className=" text-xl rounded-lg p-3 hover:bg-light-gray"
          >
            <BsShield />
          </Link>

          <div>
            <p className="font-semibold dark:text-gray-200 ">Tareas</p>
            <p className="text-gray-500 text-sm dark:text-gray-400"> Kanban  </p>
          </div>
        </div>
      </div>


      <div className="mt-5">
        <Link
          className="Button"
          style={{
            color: "white",
            backgroundColor: currentColor,
            borderRadius: "10px",
            width: "full",
            padding: '10px 20px'
          }}
          to="/"
          onClick={() => { vaciarProject();logout(); }}>Cerrar Sesión</Link>


      </div>


    </div>

  );
};

export default PerfilUsuario;