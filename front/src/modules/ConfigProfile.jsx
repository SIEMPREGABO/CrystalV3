import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSchema } from "../schemas/auth";
import { useForm } from 'react-hook-form';
import Header from "./Header";

export const ConfigProfile = () => {
    const { user, updateUser, message, autherrors, setAutherrors, setMessage } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateSchema),
        defaultValues: user
    });

    const onSubmit = handleSubmit(async (values) => {
        updateUser(values);
    });

    useEffect(() => {
        setAutherrors([]);
        setMessage([]);
    }, [])

    return (
        <div>
            <Header />
            <div className="relative d-flex flex-col justify-center align-items-center min-h-screen overflow-hidden">


                {message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                    <p class="text-lg font-semibold m-2">{message}</p>
                </div>
                }
                {autherrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                    <p class="text-lg font-semibold m-2">{autherrors}</p>
                </div>
                }
                <div className="6 card p-5" style={{width: 50+"%"}}>
                    <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase ">
                        Configuración
                    </h1>
                    <form className="" onSubmit={handleSubmit(onSubmit)} >
                        <div className="mb-2">
                            <label
                                htmlFor="NOMBRE_PILA"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Nombres(s)
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name='NOMBRE_PILA'
                                placeholder='Nombre(s)'
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                {...register("NOMBRE_PILA", { required: true, message: "Campo requerido" })}
                            />
                            {errors.NOMBRE_PILA &&
                                <div className="p-2">
                                    <div className=" bg-danger mt-2 text-white shadow ">{errors.NOMBRE_PILA.message}</div>
                                </div>
                            }
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="APELLIDO_PATERNO"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Apellido Paterno
                            </label>
                            <input
                                type="text"
                                name='APELLIDO_PATERNO'
                                placeholder='Apellido Paterno'
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                {...register("APELLIDO_PATERNO", { required: true, message: "Campo requerido" })}
                            />
                            {errors.APELLIDO_PATERNO &&
                                <div className="p-2">
                                    <div className=" bg-danger mt-2 text-white shadow ">{errors.APELLIDO_PATERNO.message}</div>
                                </div>
                            }
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="APELLIDO_MATERNO"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Apellido Materno
                            </label>
                            <input
                                type="text"
                                name='APELLIDO_MATERNO'
                                placeholder='Apellido Materno'
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                {...register("APELLIDO_MATERNO", { required: true, message: "Campo requerido" })}
                            />
                            {errors.APELLIDO_MATERNO &&
                                <div className="p-2">
                                    <div className=" bg-danger mt-2 text-white shadow ">{errors.APELLIDO_MATERNO.message}</div>
                                </div>
                            }
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="NOMBRE_USUARIO"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                name='NOMBRE_USUARIO'
                                placeholder='Nombre de Usuario'
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                {...register("NOMBRE_USUARIO", { required: true, message: "Campo requerido" })}
                            />
                            {errors.NOMBRE_USUARIO &&
                                <div className="p-2">
                                    <div className=" bg-danger mt-2 text-white shadow ">{errors.NOMBRE_USUARIO.message}</div>
                                </div>
                            }
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="NUMERO_BOLETA"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Número de boleta
                            </label>
                            <input
                                type="text"
                                name='NUMERO_BOLETA'
                                placeholder='Numero de Boleta'
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                {...register("NUMERO_BOLETA", { required: true, message: "Campo requerido" })}
                            />
                            {errors.NUMERO_BOLETA &&
                                <div className="p-2">
                                    <div className=" bg-danger mt-2 text-white shadow ">{errors.NUMERO_BOLETA.message}</div>
                                </div>
                            }
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="TELEFONO"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Número telefónico
                            </label>
                            <input
                                type="tel"
                                name='TELEFONO'
                                placeholder='xxxxxxxxxx'
                                maxLength={10}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                {...register("TELEFONO", { required: true, message: "Campo requerido" })}
                            />
                            {errors.TELEFONO &&
                                <div className="p-2">
                                    <div className=" bg-danger mt-2 text-white shadow ">{errors.TELEFONO.message}</div>
                                </div>
                            }
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="CORREO"
                                className="block text-sm font-semibold text-gray-800"
                            >
                                Correo
                            </label>
                            <input
                                type="email"
                                name='CORREO'
                                placeholder='alguien@example.com'
                                disabled
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                {...register("CORREO", { required: true, message: "Campo requerido" })}

                            />
                        </div>
                        <div className="mt-6">
                            <input
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                                type="submit"
                                value="Guardar Cambios"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ConfigProfile;