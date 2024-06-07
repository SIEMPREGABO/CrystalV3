import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {
  GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu,
  Filter, Page, Inject, Search, Toolbar
} from '@syncfusion/ej2-react-grids';
//import {, employeesData } from '../data/dummy';
import { Header } from '../components';
import { useProject } from '../context/projectContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSchema } from '../schemas/project';
import { useAuth } from '../context/authContext';
import { AiOutlineConsoleSql } from 'react-icons/ai';
import swal from 'sweetalert';

const Usuario = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const idint = parseInt(id, 10).toString();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addSchema)
  });

  const { fechasproject, addParticipant, participants, deleteParticipant, delegarParticipant,
    ascenderParticipant, degradarParticipant, twoAdmins, getProject, vaciarProject, actualizarParticipantes } = useProject();
  const [gridParticipants, setGridParticipants] = useState([]);

  useEffect(() => {
    setGridParticipants(participants);
  }, [participants]);

  const onSubmit = handleSubmit(async (values) => {
    const data = {
      CORREO: values.CORREO,
      ID_PROYECTO: fechasproject[0].ID
    }
    const idnt = {
      ID: id
    }
    await addParticipant(data);
    await getProject(idnt);
    const participantes = await actualizarParticipantes();
    setGridParticipants(participantes);
  })

  const handleDeleteClick = (async (args) => {
    swal({
      title: "Eliminar un participante",
      text: "¿Quieres eliminar al participante?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const data = { ID: args.ID_USUARIO, ID_PROYECTO: id }
          const idnt = { ID: id }
          await deleteParticipant(data);
          await getProject(idnt);
          const participantes = await actualizarParticipantes();
          setGridParticipants(participantes);
        }
      });
  });

  const handleDelegarClick = async (args) => {
    swal({
      title: "Delegar a un participante",
      text: "¿Quieres delegar al participante?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const data = {
            ID: args.ID_USUARIO,
            ID_PROYECTO: id,
          }
          const idnt = {
            ID: id
          }
          await delegarParticipant(data);
          await getProject(idnt);
          const participantes = await actualizarParticipantes();
          setGridParticipants(participantes);
        }
      });
  };

  const handleDegradarClick = async (args) => {
    swal({
      title: "Degradar a un administrador",
      text: "¿Quieres degradar al administrador?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const data = {
            ID: args.ID_USUARIO,
            ID_PROYECTO: id,
          }
          const idnt = {
            ID: id
          }
          await degradarParticipant(data);
          if (data.ID === user.ID) {
            const timer = setTimeout(() => {
              vaciarProject();
              window.location.href = `/panel`;
            }, 5000);
            return () => clearTimeout(timer);
          } else {
            await getProject(idnt);
            const participantes = await actualizarParticipantes();
            setGridParticipants(participantes);
          }
        }
      });


  };

  const handleAscenderClick = async (args) => {
    swal({
      title: "Ascender a un administrador",
      text: "¿Quieres ascender al administrador?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          const data = {
            ID: args.ID_USUARIO,
            ID_PROYECTO: id,
            ID_admin: user.ID
          }
          const idnt = {
            ID: id
          }
          await ascenderParticipant(data);
          await getProject(idnt);
          const participantes = await actualizarParticipantes();
          setGridParticipants(participantes);
        }
      });
  };
  /*
  useEffect(() => {
    if (!hasLoaded && participants.length > 0 && fechasproject.length > 0) {
      setHasLoaded(true);
    }
  }, [hasLoaded, participants,fechasproject]);

  useEffect(() => {
    if (hasLoaded) {
      console.log("Lista de participantes actualizada:", participants, fechasproject);
      console.log("Proyecto: ", participants, fechasproject);
    }
  }, [hasLoaded, participants,fechasproject]);
  */
  const employeesGrid = [
    ...(participants && fechasproject ? [
      {
        field: 'NOMBRE_USUARIO',
        headerText: 'Nombre de Usuario',
        width: '150',
        textAlign: 'Center',
        template: (props) => {
          return props.NOMBRE_USUARIO;
        }
      },
      {
        field: 'ID_USUARIO',
        headerText: 'ID Usuario',
        width: '120',
        textAlign: 'Center',
        template: (props) => {
          return props.ID_USUARIO;
        }
      },
      {
        field: 'FECHA_UNION',
        headerText: 'Fecha de Unión',
        width: '130',
        textAlign: 'Center',
        format: 'yMd',
        template: (props) => {
          return props.FECHA_UNION;
        }
      },
      {
        field: 'NUMERO_BOLETA',
        headerText: 'Número Boleta',
        width: '130',
        textAlign: 'Center',
        template: (props) => {
          return props.NUMERO_BOLETA;
        }
      },

      {
        field: 'Eliminar',
        headerText: 'Eliminar',
        width: '120',
        textAlign: 'Center',
        template: (props) => (
          props.ROLE === 0 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
              onClick={() => handleDeleteClick(props)}>Eliminar
            </button>
          )
        )
      },
      ...(fechasproject && fechasproject[0]?.ID_CATEGORIA_CRYSTAL === 1 ?
        [
          {
            field: 'Delegar',
            headerText: 'Delegar',
            width: '120',
            textAlign: 'Center',
            template: (props) => (
              props.ROLE === 0 && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
                  onClick={() => handleDelegarClick(props)}>Delegar
                </button>
              )
            )
          }
        ] : []),
      ...(fechasproject && fechasproject[0]?.ID_CATEGORIA_CRYSTAL === 2 && twoAdmins ?
        [
          {
            field: 'Degradar',
            headerText: 'Degradar',
            width: '120',
            textAlign: 'Center',
            template: (props) => (
              props.ROLE === 1 && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
                  onClick={() => handleDegradarClick(props)}>Degradar
                </button>
              )
            )
          }
        ] : []),
      ...(fechasproject && fechasproject[0]?.ID_CATEGORIA_CRYSTAL === 2 && !twoAdmins ?
        [
          {
            field: 'Ascender',
            headerText: 'Ascender',
            width: '120',
            textAlign: 'Center',
            template: (props) => (
              props.ROLE === 0 && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
                  onClick={() => handleAscenderClick(props)}>Ascender
                </button>
              )
            )
          }
        ] : [])
    ] : [])
  ];


  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="Page" title="Usuarios" />
      <div className="card rounded-lg shadow-sm bg-white ">
        <GridComponent
          dataSource={gridParticipants}
          allowPaging={true}
          allowSorting={true}
          allowDeleting={true}
          toolbar={['Search']}
          width="auto"
        >
          <ColumnsDirective>
            {employeesGrid.map((item, index) => (
              <ColumnDirective key={index}{...item} />
            ))}
          </ColumnsDirective>
          <Inject services={[Page, Search, Toolbar]} />
        </GridComponent>

        <div className="card-body row justify-content-evenly">
          <div className="col">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <div className="p-2 px-2 row justify-content-evenly">
                <input
                  className="shadow-sm bg-gray-50 border border-l-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  type="text"
                  name="CORREO"
                  placeholder="Correo del participante"
                  {...register("CORREO", { required: true, message: "campo requerido" })}
                />

                <div className="col">
                  <input className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-0" type="submit" value="Unir al proyecto" />
                </div>

                <div className="col">
                  {errors.CORREO && <div class="flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">{errors.CORREO.message}</div>}
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Usuario;