import styles from '../css/voicereq.module.css';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useProject } from "../context/projectContext.js";
import { zodResolver } from '@hookform/resolvers/zod';
import { requerimientoSchema } from '../schemas/project.js';

export const Requerimientos = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(requerimientoSchema)
    });

    const { createRequirements, entregaactual, fechasproject, projecterrors, message } = useProject();

    const onSubmit = handleSubmit(async (values) => {

        const data = {
            OBJETIVO: values.OBJETIVO,
            DESCRIPCION: values.DESCRIPCION,
            TIPO: values.TIPO_REQ,
            ID_ENTREGA: entregaactual.ID
        };

        console.log(data);

        createRequirements(data);
    });

    return (
        <div className={styles.App}>
            <header className={styles['App-header']}>
                {fechasproject[0].ESTADO === "En espera" &&
                    <div>
                        {entregaactual === "" &&
                            <div className="w-full p-6 m-auto bg-white rounded-md  ring-indigo-600 lg:max-w-xl">
                                No puedes asignar requerimientos
                            </div>}
                    </div>
                }
                {fechasproject[0].ESTADO === "Finalizado" &&
                    <div>
                        {entregaactual === "" &&
                            <div className="w-full p-6 m-auto bg-white rounded-md  ring-indigo-600 lg:max-w-xl">
                                No puedes asignar requerimientos
                            </div>}
                    </div>
                }
                {fechasproject[0].ESTADO === "En desarrollo" &&
                    <div className={styles.container}>
                        {entregaactual !== "" &&
                            <div>
                                <h1 className={styles.titulo}>Agregar Requerimiento</h1>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-1">
                                        <label className={styles.labels}>Objetivo: </label>
                                        <input type="text" className="form-control" id="exampleFormControlInput1" name="OBJETIVO"
                                            placeholder="objetivo del requerimiento"
                                            {...register("OBJETIVO", { required: true, message: "Campo Requerido" })} />
                                        {errors.OBJETIVO &&
                                            <div className="p-2">
                                                <div className=" bg-danger mt-2 text-white shadow ">{errors.OBJETIVO.message}</div>
                                            </div>
                                        }
                                    </div>
                                    <div className="mb-1">
                                        <label className={styles.labels}>Descripción: </label>
                                        <textarea className="form-control" id="exampleFormControlTextarea1" name="DESCRIPCION"
                                            rows="3" placeholder='describe el requerimiento'
                                            {...register("DESCRIPCION", { required: true, message: "Campo Requerido" })}>
                                        </textarea>
                                        {errors.DESCRIPCION &&
                                            <div className="p-2">
                                                <div className=" bg-danger mt-2 text-white shadow ">{errors.DESCRIPCION.message}</div>
                                            </div>
                                        }
                                    </div>
                                    <div className="mb-1">
                                        <label className={styles.labels}>Tipo de Requerimiento: </label>
                                        <select {...register("TIPO_REQ", { required: true, message: "Campo Requerido" })} className='form-select' defaultValue="0">
                                            <option value="0" >Selecciona el tipo de requerimiento</option>
                                            <option value="1">Requerimiento Funcional</option>
                                            <option value="2">Requerimiento No Funcional</option>
                                            <option value="3">Requerimiento de Rendimiento</option>
                                            <option value="4">Requerimiento de Seguridad</option>
                                            <option value="5">Requerimiento de Calidad</option>
                                            <option value="6">Solicitud de Cambio</option>
                                        </select>
                                        {errors.TIPO_REQ &&
                                            <div className="p-2">
                                                <div className=" bg-danger mt-2 text-white shadow ">{errors.TIPO_REQ.message}</div>
                                            </div>
                                        }
                                    </div>
                                    <div className='mt-3 row'>
                                        <div className='mt-3 d-flex justify-content-center'>
                                            <button type="submit" className="btn btn-primary">Agregar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                }
            </header>
        </div>
    );
}

export default Requerimientos;