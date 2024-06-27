import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { projectSchema } from '../schemas/project.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProject } from "../context/projectContext.js";
import { useAuth } from "../context/authContext";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import moment from 'moment-timezone';
import { ScheduleComponent, Day, Month, ViewsDirective, ViewDirective, Agenda, Resize, DragAndDrop, Inject } from '@syncfusion/ej2-react-schedule';
import swal from 'sweetalert';


export const FormProyect = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema)
    });

    const navigate = useNavigate();
    const { create, IsCreated, createProject } = useProject();
    const { user } = useAuth();
    const [scheduleData, setScheduleData] = useState([]);
    const [view, setView] = useState('form');
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);



    const onSubmit = handleSubmit(async (values) => {
        if (view === 'manual') {
            const FECHAS = [];
            let contador = 0;
            const entregas = parseInt(values.ENTREGAS, 10);
            const iteraciones = parseInt(values.ITERACIONES, 10);
            let fechainicial = moment(values.FECHA_INICIO).tz('America/Mexico_City');
            let fechafinal = moment(values.FECHA_TERMINO).tz('America/Mexico_City');
            let diasDiferencia = fechafinal.diff(fechainicial, 'days') + 1;

            if (diasDiferencia < 30) {
                swal({
                    title: 'Crear proyecto',
                    text: 'Muy pocos dias de proyecto',
                    icon: 'warning',
                    button: 'Aceptar',
                });
                return;
            }
            else if (diasDiferencia > 365) {
                swal({
                    title: 'Crear proyecto',
                    text: 'Muchos dias de proyecto',
                    icon: 'warning',
                    button: 'Aceptar',
                });
                return;
            }
            else if (diasDiferencia > 240 && diasDiferencia < 365 && entregas < 3) {
                swal({
                    title: 'Crear proyecto',
                    text: 'Agrega mas entregas a tu proyecto',
                    icon: 'warning',
                    button: 'Aceptar',
                  });
                return;
            } else if (diasDiferencia > 60 && diasDiferencia <= 90 && entregas > 3) {
                swal({
                    title: 'Crear proyecto',
                    text: 'Son muchas entregas en el proyecto',
                    icon: 'warning',
                    button: 'Aceptar',
                  });
                return;
            } else if (diasDiferencia <= 60 && diasDiferencia > 30 && entregas > 2) { swal({
                title: 'Crear proyecto',
                text: 'En un poryecto tan corto solo puedes hacer 2 entregas',
                icon: 'warning',
                button: 'Aceptar',
              });
            return; 
        }

            FECHAS.push({
                Subject: `${values.NOMBRE_PROYECTO}`,
                Id: contador,
                Id_Proyecto: 0,
                StartTime: fechainicial.format('YYYY-MM-DD HH:mm:ss'),
                EndTime: fechafinal.endOf('day').format('YYYY-MM-DD 23:59:59')
            });
            contador++;

            const PARTES_ENTREGAS = Math.floor(diasDiferencia / entregas);
            let DIAS_RESTANTES = diasDiferencia % entregas;
            const ARRAYPARTES = Array(entregas).fill(PARTES_ENTREGAS);

            let k = 0;
            while (DIAS_RESTANTES > 0) {
                ARRAYPARTES[k]++;
                DIAS_RESTANTES -= 1;
                k++;
                if (ARRAYPARTES.length === k) {
                    k = 0;
                }
            }
            console.log(ARRAYPARTES);

            let INICIOPARTE = fechainicial.clone();
            for (let i = 0; i < entregas; i++) {
                let FINPARTE = INICIOPARTE.clone().add(ARRAYPARTES[i] - 1, 'days');
                FECHAS.push({
                    Subject: `Entrega ${contador}`,
                    Id: contador,
                    Id_Proyecto: 0,
                    Id_Entrega: i + 1,
                    StartTime: INICIOPARTE.format('YYYY-MM-DD 00:00:00'),
                    EndTime: FINPARTE.endOf('day').format('YYYY-MM-DD 23:59:59')
                });
                INICIOPARTE = FINPARTE.clone().add(1, 'day');
                contador++;
            }

            for (let i = 1; i < (entregas + 1); i++) {
                const FECHA_INICIAL_ENTREGA = moment(FECHAS[i].StartTime);
                const FECHA_FINAL_ENTREGA = moment(FECHAS[i].EndTime);
                const DIAS_ENTREGA = FECHA_FINAL_ENTREGA.diff(FECHA_INICIAL_ENTREGA, 'days') + 1;
                const PARTES_ITERACIONES = Math.floor(DIAS_ENTREGA / iteraciones);
                let DIAS_RESTANTES_ENTREGA = DIAS_ENTREGA % iteraciones;
                const ARRAY_PARTES_ITERACIONES = Array(iteraciones).fill(PARTES_ITERACIONES);

                let k = 0;
                while (DIAS_RESTANTES_ENTREGA > 0) {
                    ARRAY_PARTES_ITERACIONES[k]++;
                    DIAS_RESTANTES_ENTREGA -= 1;
                    k++;
                    if (ARRAY_PARTES_ITERACIONES.length === k) {
                        k = 0;
                    }
                }

                let INICIOPARTE = FECHA_INICIAL_ENTREGA.clone();

                for (let j = 0; j < entregas; j++) {
                    let FINPARTE = INICIOPARTE.clone().add(ARRAY_PARTES_ITERACIONES[j] - 1, 'days');
                    FECHAS.push({
                        Subject: `Entrega ${i} Iteracion ${j}`,
                        Id: contador,
                        Id_Entrega: FECHAS[i].Id_Entrega,
                        Id_Iteracion: contador,
                        StartTime: INICIOPARTE.format('YYYY-MM-DD HH:mm:ss'),
                        EndTime: FINPARTE.format('YYYY-MM-DD 23:59:59')
                    });
                    INICIOPARTE = FINPARTE.clone().add(1, 'day');
                    contador++;
                }
            }

            console.log(FECHAS);
            setScheduleData(FECHAS);
            const info = {
                NOMBRE_PROYECTO: values.NOMBRE_PROYECTO,
                OBJETIVO: values.OBJETIVO,
                DESCRIPCION_GNRL: values.DESCRIPCION_GNRL,
                FECHA_INICIO: values.FECHA_INICIO,
                FECHA_TERMINO: values.FECHA_TERMINO,
                ENTREGAS: values.ENTREGAS,
                ITERACIONES: values.ITERACIONES,
                ID: user.ID,
                CORREO: user.CORREO
            };
            setData(info);
            setShowModal(true);
        } else if (view === 'form') {
            const data = {
                NOMBRE_PROYECTO: values.NOMBRE_PROYECTO,
                OBJETIVO: values.OBJETIVO,
                DESCRIPCION_GNRL: values.DESCRIPCION_GNRL,
                FECHA_INICIO: values.FECHA_INICIO,
                FECHA_TERMINO: values.FECHA_TERMINO,
                ENTREGAS: values.ENTREGAS,
                ID: user.ID,
                CORREO: user.CORREO
            };
            create(data);
        }
    });

    const handleSendData = async () => {

        const send = {
            DATA: data,
            SCHEDULE: scheduleData
        }
        console.log(send)
        createProject(send);
    }

    const handleViewChange = (event) => {
        setView(event.target.value);
    };

    useEffect(() => {
        if (IsCreated) navigate("/panel");
    }, [IsCreated, navigate]);

    return (
        <div>
            <Header />
            <div className="relative flex flex-col justify-center min-h-svh overflow-hidden">
                <div className="w-full p-3 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase mt-3">
                        {view === 'form' ? 'Crea tu Proyecto' : 'Otra Vista'}
                    </h1>
                    <select className="mt-6 mb-6" onChange={handleViewChange}>
                        <option value="form">Rápido</option>
                        <option value="manual">Manual</option>
                    </select>
                    {view === 'form' ? (
                        <form className="mt-4" onSubmit={onSubmit}>
                            <div className="mb-2">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Título del proyecto:
                                </label>
                                <input
                                    className="block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    type="text"
                                    name="NOMBRE_PROYECTO"
                                    placeholder='Título'
                                    {...register("NOMBRE_PROYECTO", { required: true })}
                                />
                                {errors.NOMBRE_PROYECTO && <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.NOMBRE_PROYECTO.message}</div>}
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Descripción del proyecto:
                                </label>
                                <textarea
                                    className="block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    style={{ height: "75px" }}
                                    placeholder="Descripción del proyecto"
                                    name="DESCRIPCION_GNRL"
                                    {...register("DESCRIPCION_GNRL", { required: true })}
                                />
                                {errors.DESCRIPCION_GNRL && <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.DESCRIPCION_GNRL.message}</div>}
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Objetivo del proyecto:
                                </label>
                                <textarea
                                    className="block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    style={{ height: "75px" }}
                                    placeholder="Objetivo del proyecto"
                                    name="OBJETIVO"
                                    {...register("OBJETIVO", { required: true })}
                                />
                                {errors.OBJETIVO && <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.OBJETIVO.message}</div>}
                            </div>

                            <div className="mb-2 items-center">
                                <div className="flex flex-row">
                                    <div className='flex-row mr-2'>
                                        <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                                            Fecha de Inicio:
                                        </label>
                                        <input
                                            className="block w-full px-4 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                            type="date"
                                            name="FECHA_INICIO"
                                            {...register("FECHA_INICIO", { required: true })}
                                        />
                                        {errors.FECHA_INICIO && <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.FECHA_INICIO.message}</div>}
                                    </div>
                                    <div className="flex-row mr-2">
                                        <label htmlFor="FECHA_TERMINO" className="block text-sm font-semibold text-gray-800">
                                            Fecha de finalización:
                                        </label>
                                        <input
                                            className="block w-full px-4 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                            type="date"
                                            name="FECHA_TERMINO"
                                            {...register("FECHA_TERMINO", { required: true })}
                                        />
                                        {errors.FECHA_TERMINO && <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.FECHA_TERMINO.message}</div>}
                                    </div>
                                    <div className="flex-row">
                                        <label htmlFor="ENTREGAS" className="block text-sm font-semibold text-gray-800">
                                            Entregas:
                                        </label>
                                        <input
                                            className="block w-full px-4 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                            type="number"
                                            placeholder="ENTREGAS"
                                            name="ENTREGAS"
                                            {...register("ENTREGAS", { required: true })}
                                        />
                                        {errors.ENTREGAS && <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.ENTREGAS.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <button
                                    className="text-center hover:text-white w-full px-4 py-2 tracking-wide text-white-800 transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                                    type="submit"
                                >
                                    Crear Proyecto
                                </button>
                            </div>
                        </form>
                    ) :
                        (

                            <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-2">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Titulo del proyecto:
                                    </label>
                                    <input
                                        className="block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                        type="text"
                                        name="NOMBRE_PROYECTO"
                                        placeholder='Título'
                                        {...register("NOMBRE_PROYECTO", { required: true, message: "Campo requerido" })}
                                    />
                                    {errors.NOMBRE_PROYECTO && <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md">{errors.NOMBRE_PROYECTO.message}</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Descripcion del proyecto:
                                    </label>
                                    <textarea
                                        className=" block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 "
                                        style={{ height: "75px" }}
                                        placeholder="Descripción del proyecto"
                                        name="DESCRIPCION_GNRL"
                                        {...register("DESCRIPCION_GNRL", { required: true, message: "Campo requerido" })}
                                    />
                                    {errors.DESCRIPCION_GNRL && <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md">{errors.DESCRIPCION_GNRL.message}</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Objetivo del proyecto:
                                    </label>
                                    <textarea
                                        className=" block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 "
                                        style={{ height: "75px" }}
                                        placeholder="Objetivo del proyecto"
                                        name="OBJETIVO"
                                        {...register("OBJETIVO", { required: true, message: "Campo requerido" })}
                                    />
                                    {errors.OBJETIVO && <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md">{errors.OBJETIVO.message}</div>}
                                </div>

                                <div className="mb-2 items-center">
                                    <div className="flex flex-row ">
                                        <div className='flex-row mr-2'>
                                            <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                                                Fecha de Inicio:
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                                type="date"
                                                name="FECHA_INICIO"
                                                {...register("FECHA_INICIO", { required: true, message: "Campo requerido" })}
                                            />
                                            {errors.FECHA_INICIO && <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md">{errors.FECHA_INICIO.message}</div>}
                                        </div>
                                        <div className="flex-row mr-2">
                                            <label htmlFor="FECHA_TERMINO" className="block text-sm font-semibold text-gray-800">
                                                Fecha de finalización:
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                                type="date"
                                                name="FECHA_TERMINO"
                                                {...register("FECHA_TERMINO", { required: true, message: "Campo requerido" })}
                                            />
                                            {errors.FECHA_TERMINO && <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md">{errors.FECHA_TERMINO.message}</div>}
                                        </div>

                                    </div>
                                </div>

                                <div className="mb-2 items-center">
                                    <div className="flex flex-row ">
                                        <div className="flex-row  mr-2">
                                            <label htmlFor="ENTREGAS" className="block text-sm font-semibold text-gray-800">
                                                Entregas del proyecto:
                                            </label>
                                            <select
                                                className="block w-full px-3 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                                name="ENTREGAS"
                                                {...register("ENTREGAS", { required: true, message: "Campo requerido" })}
                                            >
                                                <option value="0">Entregas</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                            </select>
                                            {errors.ENTREGAS && <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md">{errors.ENTREGAS.message}</div>}
                                        </div>

                                        <div className="flex-row  mr-2">
                                            <label htmlFor="ITERACIONES" className="block text-sm font-semibold text-gray-800">
                                                Iteraciones del proyecto:
                                            </label>
                                            <select
                                                className="block w-full px-3 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                                name="ITERACIONES"
                                                {...register("ITERACIONES", { required: true, message: "Campo requerido" })}
                                            >
                                                <option value="0">ITERACIONES</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                            </select>
                                            {errors.ENTREGAS && <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md">{errors.ENTREGAS.message}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <button type='submit' className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
                                        Crear proyecto
                                    </button>
                                </div>
                            </form>
                        )}
                </div>
                {showModal && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-center min-h-screen px-2 py-4">
                            <div className="relative w-full max-w-3xl p-3 mx-auto bg-white rounded-md shadow-lg">
                                <h4 className="text-lg font-medium text-gray-800">Confirmación</h4>
                                <div className="bg-white-200 h-[800px] m-4">
                                    <ScheduleComponent height="800px" width="100%" eventSettings={{ dataSource: scheduleData }}>
                                        <ViewsDirective>
                                            <ViewDirective option='Month' showWeekNumber={true} />
                                        </ViewsDirective>
                                        <Inject services={[Month, Resize, DragAndDrop]} />
                                    </ScheduleComponent>
                                </div>
                                <div className="items-center gap-2 m-3 sm:flex">
                                    <button
                                        className="w-full mt-2 p-2.5 flex-1 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2"
                                        onClick={handleSendData}
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default FormProyect;