import React, { useEffect } from 'react';
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

const employeesGrid = [
  { field: 'NOMBRE_USUARIO', headerText: 'Nombre de Usuario', width: '150', textAlign: 'Center' },
  { field: 'ID_USUARIO', headerText: 'ID Usuario', width: '120', textAlign: 'Center' },
  { field: 'FECHA_UNION', headerText: 'Fecha de Unión', width: '130', textAlign: 'Center', format: 'yMd' },
  { field: 'NUMERO_BOLETA', headerText: 'Número Boleta', width: '130', textAlign: 'Center' },
  /*{
    field: 'eliminar',
    headerText: 'Eliminar',
    width: '130',
    textAlign: 'Center',
    template: '<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full">Eliminar</button>',
    click: (args) => {
      console.log('Eliminar usuarios boton:', args.data.NOMBRE_USUARIO);
    }
  }*/
];

const Usuario = () => {

  const { id } = useParams();
  const {user} = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addSchema)
  });

  const { projecterrors, message, fechasproject, addParticipant, participants, deleteParticipant, delegarParticipant } = useProject();

  const onSubmit = handleSubmit(async (values) => {
    const data = {
      CORREO: values.CORREO,
      ID_PROYECTO: fechasproject[0].ID
    }
    addParticipant(data);

    const timer = setTimeout(() => {
      window.location.reload();
    }, 5000);
    return () => clearTimeout(timer);

  })

  const handleDeleteClick = async (args) => {
    const data = {
      ID: args.ID_USUARIO,
      ID_PROYECTO: id
    }
    deleteParticipant(data);

    const timer = setTimeout(() => {
      window.location.reload();
    }, 5000);
    return () => clearTimeout(timer);

  };

  const handleDelegarClick = async (args) => {
    const data = {
      ID: args.ID_USUARIO,
      ID_PROYECTO: id,
      ID_admin: user.ID
    }
    delegarParticipant(data);

    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 5000);
    return () => clearTimeout(timer);

  };


  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      {message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
        <p class="text-lg font-semibold m-2">{message}</p>
      </div>
      }
      {projecterrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
        <p class="text-lg font-semibold m-2">{projecterrors}</p>
      </div>
      }

      <Header category="Page" title="Usuarios" />

      <div className="card rounded-lg shadow-sm bg-white ">

        <GridComponent
          dataSource={participants}
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
            <ColumnDirective
              headerText='Eliminar'
              field='Eliminar'
              width='120'
              textAlign='Center'
              template={(props) => (
                props.ROLE === 0 && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
                    onClick={() => handleDeleteClick(props)}>Eliminar
                  </button>
                )
              )}
            />

            <ColumnDirective
              headerText='Delegar'
              field='Delegar'
              width='120'
              textAlign='Center'
              template={(props) => (
                props.ROLE === 0 && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
                    onClick={() => handleDelegarClick(props)}>Delegar
                  </button>
                )
              )}
            />

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