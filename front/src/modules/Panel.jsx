import { Link } from "react-router-dom";
import { useAuth } from '../context/authContext';
import moment from "moment";
import { useEffect } from "react";
import { useProject } from "../context/projectContext";
import { joinSchema } from "../schemas/project";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {
    GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu,
    Filter, Page, ExcelExport, PdfExport, Edit, Inject
} from '@syncfusion/ej2-react-grids';
import { Header } from './Header';
import Footer from "./Footer.jsx"

export const Panel = () => {
    const { user ,getProjects,projects} = useAuth();
    const fecha = moment.utc(user.FECHA_CREACION).format('DD-MM-YYYY');
    const { joinProject } = useProject();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(joinSchema)
    });

    const onSubmit = handleSubmit(async (values) => {
        const data = {
            ID_USUARIO: user.ID,
            CODIGO_UNIRSE: values.CODIGO_UNIRSE
        }
        joinProject(data);
        const timer = setTimeout(() => {
            window.location.reload();
        }, 5000);
        return () => clearTimeout(timer);
    })

    useEffect( () => {
         getProjects();
    }, []);

    return (
        <div>
            <Header />
            <div className="container-fluid position-relative p-4">        
                <div className="container-sm">
                    <div className="row justify-content-evenly d-md-flex flex-md-equal w-100 my-md-3 p-md-3 mx-auto">
                        <div className="text-bg-dark overflow-hidden col">

                            <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Bienvenido </span>{user.NOMBRE_USUARIO}.</h1>
                            <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">ID: {user.ID.toString().padStart(5, '0')}</p>
                            <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Formando parte desde: {fecha}</p>
                        </div>
                    </div>
                    <div className="card rounded-lg shadow-sm bg-white ">
                        <div className="card-heade bg:gray-800 font-bold py-1 px-4 flex justify-between items-center text-center">
                            <h2 className="text-center  mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-700 md:text-4xl dark:text-white">
                                <div className=" absolute top-0 right-0 h-16 w-auto pe-5 pt-2">
                                    <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-0" to="/configurar-proyecto">Crear Proyecto</Link>
                                </div>   Tus Proyectos Activos</h2>
                        </div>
                        {projects &&
                            <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
                                <GridComponent dataSource={projects} allowPaging allowSorting>
                                    <ColumnsDirective>
                                        <ColumnDirective field='ID' headerText='ID del proyecto' width='120' textAlign='Center' />
                                        <ColumnDirective field='NOMBRE' headerText='Nombre del proyecto' width='150' textAlign='Center' />
                                        <ColumnDirective field='FECHA_INI' headerText='Fecha de Inicio' width='150' textAlign='Center' template={(props) => {
                                            const fechaConsulta = props.FECHA_INICIO; // Fecha recibida desde la consulta
                                            const fecha = new Date(fechaConsulta); // Crear un objeto Date con la fecha de la consulta\
                                            const año = fecha.getFullYear();
                                            const mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, por lo que sumamos 1
                                            const dia = fecha.getDate();
                                            const fechaFormateada = `${dia}/${mes}/${año}`;
                                            return <span>{fechaFormateada}</span>;
                                        }} />

                                        <ColumnDirective field='FECHA_TERMINO' headerText='Fecha de Termino' width='150' textAlign='Center' template={(props) => {
                                            const fechaConsulta = props.FECHA_TERMINO;
                                            const fecha = new Date(fechaConsulta);
                                            const año = fecha.getFullYear();
                                            const mes = fecha.getMonth() + 1;
                                            const dia = fecha.getDate();
                                            const fechaFormateada = `${dia}/${mes}/${año}`;

                                            return <span>{fechaFormateada}</span>;
                                        }} />
                                        <ColumnDirective field='ESTADO' headerText='Estatus del proyecto' width='150' textAlign='Center' />
                                        <ColumnDirective headerText='Proyecto' field='UNIRSE' width='120' textAlign='Center' template={(props) => (
                                            <Link
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
                                                to={`/Proyecto/${(props.ID).toString().padStart(5, '0')}/Home`}>
                                                Ir al proyecto </Link>)}
                                        />
                                    </ColumnsDirective>

                                    <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
                                </GridComponent>
                            </div>}
                        {!projects &&
                            <p className="list-group-item text-start">No tienes proyectos</p>
                        }
                        <div className="card-body row justify-content-evenly">
                            <div className="col">
                                <form className="" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="p-2 px-2 row justify-content-evenly">
                                        <input
                                            className="shadow-sm bg-gray-50 border border-l-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                            type="text"
                                            name="CODIGO_UNIRSE"
                                            placeholder="Código del Proyecto"
                                            {...register("CODIGO_UNIRSE", { required: true, message: "campo requerido" })}
                                        />
                                        <div className="col">
                                            <input className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-0" type="submit" value="Unirse a proyecto" />
                                        </div>
                                        <div className="col">
                                            {errors.CODIGO_UNIRSE && <div class="flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">{errors.CODIGO_UNIRSE.message}</div>}
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Panel;