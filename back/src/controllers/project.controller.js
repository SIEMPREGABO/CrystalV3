import moment from 'moment-timezone';
import { SECRET_TOKEN } from '../config.js';
import { generarCodigo, generarEntregas } from '../libs/makerProject.js';
import {
    agregarUsuario, crearProyecto, projectsUsuario, verificarCodigo, verificarUnion,
    obtenerFechas, getParticipantsQuery, ActualizarEstado, obtenerFechasID, getRequerimientosEntrega,
    AgregarRequerimiento, verificarUnionCorreo, verificarNumeroParticipantes, CrearTarea, getTareas,
    obtenerFechasTareas, ActualizarEstadoTareas, AgregarMensaje, GetMessages,
    eliminarParticipante,
    GetTareasxIteracion, GetTareasKanban,
    DeleteTask, UpdateTask,
    getTareaDependiente,
    obtenerTareasDep,
    obtenerFechasConfigID,
    ActualizarFechasQuery,
    getUser,
    delegarParticipante,
    eliminarProyecto, getProjectInfo,
    IdUsuarios,
    registrarNotificacion,
    getTask,
    getProjectName,
    getProjectWithIter,
    actualizarCrystal,
    ascenderParticipante,
    degradarParticipante,
    getProjectWithEntrega,
    eliminarChats,
    getTareasGantt,
    getAdmins, getNotificaciones, getNotificacion, getAlerta
} from '../querys/projectquerys.js';
import jwt from 'jsonwebtoken'
import { zonaHoraria } from '../config.js';
import { createProjectToken } from '../libs/jwt.js';
import { sendemailAdd, sendemailAdmin, sendemailConfig, sendemailDeleteProject, sendemailDeleteTask, sendemailEndProject, sendemailFaseProject, sendemailJoin, sendemailProject, sendemailStartProject, sendemailTask, sendemailUpdateTask } from '../middlewares/send.mail.js';
import { actualizarEstadoNotificacion } from '../querys/authquerys.js';

export const createProject = async (req, res) => {
    const FECHA_ACTUAL = moment().tz(zonaHoraria).startOf('day');
    const { NOMBRE_PROYECTO, OBJETIVO, DESCRIPCION_GNRL, FECHA_INICIO, FECHA_TERMINO, ENTREGAS, ID, CORREO } = req.body;
    console.log(req.body);
    try {
        let dias = 7;
        const FECHA_INICIAL = moment(FECHA_INICIO).tz(zonaHoraria).startOf('day');
        const FECHA_FINAL = moment(FECHA_TERMINO).tz(zonaHoraria).endOf('day');

        if (FECHA_INICIAL.isBefore(FECHA_ACTUAL)) return res.status(400).json({ message: "Fecha inicial incorrecta" });
        if (FECHA_FINAL.isBefore(FECHA_INICIAL)) return res.status(400).json({ message: "Fecha final incorrecta" });

        const DIAS_PROYECTO = FECHA_FINAL.diff(FECHA_INICIAL, 'days') + 1;

        if (DIAS_PROYECTO < 90) return res.status(400).json({ message: "El proyecto debe durar minimo 3 meses" });
        if (DIAS_PROYECTO > 179) dias = 14;
        if (DIAS_PROYECTO > 365) return res.status(400).json({ message: "El proyecto debe durar maximo 1 año" });


        let REGISTRO_ACTUAL = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');
        let REGISTRO_INICIAL = moment(FECHA_INICIAL).format('YYYY-MM-DD HH:mm:ss');
        let REGISTRO_FINAL = moment(FECHA_FINAL).format('YYYY-MM-DD HH:mm:ss');

        const CODIGO_UNICO = await generarCodigo();

        const generarProyecto = await crearProyecto(NOMBRE_PROYECTO, OBJETIVO, DESCRIPCION_GNRL, REGISTRO_ACTUAL, REGISTRO_INICIAL, REGISTRO_FINAL, ENTREGAS, CODIGO_UNICO, ID);
        if (!generarProyecto.success) return res.status(400).json({ message: "Error al crear el proyecto" });

        const ARREGLOPROYECTO = generarEntregas(ENTREGAS, REGISTRO_INICIAL, FECHA_FINAL, generarProyecto.ID_P, dias);
        if (!ARREGLOPROYECTO) return res.status(400).json({ message: "Error al crear las entregas e iteraciones" });
        try {
            const emailsendend = await sendemailProject(CORREO, NOMBRE_PROYECTO, OBJETIVO, REGISTRO_INICIAL, REGISTRO_FINAL, CODIGO_UNICO);
            if (!emailsendend) return res.status(400).json({ message: "Error inesperado, intente nuevamente" })
        
        } catch (error) {
            
        }
        activarTareasInactivas();
        return res.status(200).json({ message: "Proyecto creado con exito" });
    } catch (error) {
        res.status(500).json({ message: "Error inesperado, intentalo de nuevo" });
        //destruirProyecto(idProyecto,ID);  
    }
}

export const getProjects = async (req, res) => {
    const token = req.cookies['token'];
    if (!token) return res.status(401).json({ message: "No autorizado" });
    jwt.verify(token, SECRET_TOKEN, async (error, user) => {
        if (error) return res.status(401).json({ message: "No autorizado" });
        const projects = await projectsUsuario(user.id);
        const projectCookies = {};
        if (projects.length > 0) {
            await Promise.all(projects.map(async (project) => {
                let role = 'participant';
                //console.log(project.admin);
                if (project.admin) {
                    role = 'admin'
                }

                const payload = {
                    ID_PROYECTO: project.ID,
                    role: role
                };
                //console.log(payload)
                const projectToken = await createProjectToken(payload);
                projectCookies[`Proyecto${project.ID}`] = projectToken;
                //console.log(projectToken);
            }));
            Object.entries(projectCookies).forEach(([name, value]) => {

                res.cookie(name, value);
            });
        }
        res.json(projects);
    })
}




export const joinProject = async (req, res) => {
    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    try {
        let mensaje = 'Enlazado al proyecto correctamente';
        const { CODIGO_UNIRSE, ID_USUARIO } = req.body;

        const proyecto = await verificarCodigo(CODIGO_UNIRSE);
        if (!proyecto.success) return res.status(404).json({ message: "Proyecto no existente" });

        const Admins = await getAdmins(proyecto.project[0].ID);

        const ES_CREADOR = false;
        let REGISTRO_ACTUAL = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');


        const numeroParticipantes = await verificarNumeroParticipantes(proyecto.project[0].ID);
        if (!numeroParticipantes.success) return res.status(400).json({ message: "Numero maximo de participantes alcanzado" });
        if (numeroParticipantes.participantes.length === 8) {
            const actualizarCrystal = await actualizarCrystal(2, proyecto.project[0].ID);
        }
        const registrado = await verificarUnion(proyecto.project[0].ID, ID_USUARIO);
        if (registrado.success) return res.status(400).json({ message: "Ya estas participando en el proyecto" })
        const union = await agregarUsuario(REGISTRO_ACTUAL, ES_CREADOR, proyecto.project[0].ID, ID_USUARIO);
        if (!union.success) return res.status(500).json({ message: "Usuario agregado con exito" });


        await Promise.all(Admins.map(async (adminID) => {
            const meterNotificacion = registrarNotificacion(
                adminID.ID_USUARIO,
                `Se ha unido un usuario a tu proyecto`,
                9,
                REGISTRO_ACTUAL
            )
            const correoParticipante = await getUser(adminID.ID_USUARIO);
            try {
                await sendemailAdmin(proyecto.project[0], correoParticipante[0].CORREO);
            } finally { }
        }));

        const correoParticipante = await getUser(ID_USUARIO);

        const emailsendend = await sendemailJoin(correoParticipante[0].CORREO, proyecto.project[0]);
        if (!emailsendend) return res.status(400).json({ message: "Error inesperado, intente nuevamente" })

        return res.status(200).json({ message: 'Enlazado al proyecto correctamente' });
    } catch (error) {
        return res.status(500).json({ message: "Error inesperado, intentalo de nuevo" });
    }
}

export const getPermissions = async (req, res) => {
    const { ID } = req.body;
    const namecookie = `Proyecto${ID}`;
    try {
        const cookieValue = req.cookies[namecookie];
        if (!cookieValue) return res.status(401).json({ message: "No autorizado" });
        jwt.verify(cookieValue, SECRET_TOKEN, async (err, user) => {
            if (err) return res.status(500).json({ message: "Error inesperado, intentalo de nuevo" });
            //console.log(user);
            return res.json({
                ID: user.ID_PROYECTO,
                role: user.role
            });
        }
        );
    } catch (error) {
        return res.status(500).json({ message: "Error inesperado, intentalo de nuevo" });

    }
}

export const getProject = async (req, res) => {
    const { ID, USER } = req.body; //////////////
    const ID_PROYECTO = ID;
    try {
        const FECHAS_PROYECTO = await obtenerFechasID("PROYECTOS", ID_PROYECTO);
        let ENTREGA_ACTUAL = "";
        let ITERACION_ACTUAL = "";
        const FECHAS_ENTREGAS = await obtenerFechasID("ENTREGAS", ID_PROYECTO);

        const FECHAS_ITERACIONES = await Promise.all(FECHAS_ENTREGAS.map(async (ENTREGA) => {
            const FECHAS_ITERACION = await obtenerFechasID("ITERACIONES", ENTREGA.ID);
            return (FECHAS_ITERACION);
        }));

        const participants = await getParticipantsQuery(ID_PROYECTO);

        FECHAS_ENTREGAS.map((ENTREGA) => {
            if (ENTREGA.ESTADO === 'En desarrollo') {
                ENTREGA_ACTUAL = ENTREGA;
            }
        });
        FECHAS_ITERACIONES.map((ITERACIONESPORENTREGA) => {
            ITERACIONESPORENTREGA.map((ITERACION) => {
                if (ITERACION.ESTADO === 'En desarrollo') {
                    ITERACION_ACTUAL = ITERACION;
                }
            })
        });

        const tareasGantt = await getTareasGantt(ID_PROYECTO);
        const requerimientos = await getRequerimientosEntrega(ENTREGA_ACTUAL.ID);
        const tasks = await getTareas(ITERACION_ACTUAL.ID);
        const tasksKanban = await GetTareasKanban(ITERACION_ACTUAL.ID);
        const projectInfo = await getProjectInfo(ID_PROYECTO);
        const notificaciones = await getNotificaciones(USER); /////////////////
        let allNotificaciones = [];

        if (notificaciones.length > 0) {
            allNotificaciones = await Promise.all(
                notificaciones.map(async (Notificacion) => {
                    const notificacionData = await getNotificacion(Notificacion.ID_NOTIFICACION);
                    console.log(notificacionData[0].ID_TIPO_NOTIFICACION)
                    const alerta = await getAlerta(notificacionData[0].ID_TIPO_NOTIFICACION);
                    console.log(alerta);
                    const combinedData = {
                        ...notificacionData[0], // Copia todas las propiedades de notificacionData
                        ESTADO_VISUALIZACION: Notificacion.ESTADO_VISUALIZACION, // Añade ESTADO_VISUALIZACION
                        PRIORIDAD: alerta[0].PRIORIDAD
                    };
                    return combinedData;
                })
            )
        }
        console.log(allNotificaciones);
        const data = {
            fechasProyecto: FECHAS_PROYECTO,
            fechasEntregas: FECHAS_ENTREGAS,
            fechasIteraciones: FECHAS_ITERACIONES,
            entregaActual: ENTREGA_ACTUAL,
            iteracionactual: ITERACION_ACTUAL,
            participants: participants,
            requerimientos: requerimientos,
            tasks: tasks,
            tasksKanban: tasksKanban,
            projectInfo: projectInfo,
            tareasGantt: tareasGantt,
            notificaciones: allNotificaciones
        };
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

export const cambiarEstado = async (req, res) => {
    const notificaciones = req.body;
    try {
        await Promise.all(notificaciones.map(async (notificacion)=>{
            await actualizarEstadoNotificacion(notificacion.ID);
        }));
        res.status(200).json({message : "Notificaciones cambiada"});
    } catch (error) {
        res.status(500).json({ mensaje: "Error inesperado, intentalo nuevamente" });
    }
}

export const getTasks = async (req, res) => {
    const { ID_ITERACION } = req.body;
    try {
        const tasks = await getTareas(ID_ITERACION);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ mensaje: "Error inesperado, intentalo nuevamente" });
    }
}

// meter al getProject
export const getTareasxIteracion = async (req, res) => {
    const { ID_PROYECTO } = req.body;

    try {
        const tareasxiteracion = await GetTareasxIteracion(ID_PROYECTO);
        res.json(tareasxiteracion);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al intentar obtener mensajes" })
    }
};

export const configurarProyecto = async (req, res) => {
    try {
        const FECHA_ACTUAL = moment().tz(zonaHoraria);
        const elementos = req.body;
        const proyectos = [];
        const entregas = [];
        const iteraciones = [];
        //Llena el arreglo de las fechas
        elementos.forEach(elemento => {
            let FECHA_INICIO = moment(elemento.StartTime).format('YYYY-MM-DD HH:mm:ss');
            let FECHA_FINAL = moment(elemento.EndTime).format('YYYY-MM-DD HH:mm:ss');

            if (!(moment(FECHA_FINAL).hour() === 23 && moment(FECHA_FINAL).minute() === 59 && moment(FECHA_FINAL).second() === 59)) {
                FECHA_FINAL = moment(FECHA_FINAL).subtract(1, 'second').format('YYYY-MM-DD HH:mm:ss');
            }

            if (elemento.Id_project) {
                if (elemento.Guid) {
                    proyectos.push({
                        Title: elemento.Subject,
                        Id: elemento.Id,
                        Id_project: elemento.Id_project,
                        State: elemento.State,
                        StartTime: FECHA_INICIO,
                        EndTime: FECHA_FINAL,
                        modificado: true
                    })
                } else {
                    proyectos.push({
                        Title: elemento.Subject,
                        Id: elemento.Id,
                        Id_project: elemento.Id_project,
                        State: elemento.State,
                        StartTime: FECHA_INICIO,
                        EndTime: FECHA_FINAL,
                        modificado: false
                    })
                }
            }

            if (elemento.Id_entrega && elemento.Id_proyecto) {
                if (elemento.Guid) {
                    entregas.push({
                        Title: elemento.Subject,
                        Id: elemento.Id,
                        Id_proyecto: elemento.Id_proyecto,
                        Id_entrega: elemento.Id_entrega,
                        State: elemento.State,
                        StartTime: FECHA_INICIO,
                        EndTime: FECHA_FINAL,
                        modificado: true
                    })
                } else {
                    entregas.push({
                        Title: elemento.Subject,
                        Id: elemento.Id,
                        Id_proyecto: elemento.Id_proyecto,
                        Id_entrega: elemento.Id_entrega,
                        State: elemento.State,
                        StartTime: FECHA_INICIO,
                        EndTime: FECHA_FINAL,
                        modificado: false
                    })
                }
            }

            if (elemento.Id_entrega && elemento.Id_iteracion) {
                if (elemento.Guid) {
                    iteraciones.push({
                        Title: elemento.Subject,
                        Id: elemento.Id,
                        Id_iteracion: elemento.Id_iteracion,
                        Id_entrega: elemento.Id_entrega,
                        State: elemento.State,
                        StartTime: FECHA_INICIO,
                        EndTime: FECHA_FINAL,
                        modificado: true
                    })
                } else {
                    iteraciones.push({
                        Title: elemento.Subject,
                        Id: elemento.Id,
                        Id_iteracion: elemento.Id_iteracion,
                        Id_entrega: elemento.Id_entrega,
                        State: elemento.State,
                        StartTime: FECHA_INICIO,
                        EndTime: FECHA_FINAL,
                        modificado: false
                    })
                }
            }
        });

        const FECHA_INICIAL = moment(proyectos[0].StartTime); const FECHA_FINAL = moment(proyectos[0].EndTime);

        const diasDiferenciaProyecto = FECHA_FINAL.diff(FECHA_INICIAL, 'days') + 1;

        if (diasDiferenciaProyecto < 90 && proyectos[0].modificado) return res.status(400).json({ message: "El proyecto debe durar minimo 3 meses" });

        if (diasDiferenciaProyecto > 365 && proyectos[0].modificado) return res.status(400).json({ message: "El proyecto debe durar maximo 1 año" });

        const autorizacion = await obtenerFechasConfigID("PROYECTOS", proyectos[0].Id_project);

        if (proyectos[0].State === 'En desarrollo' && proyectos[0].modificado && !moment(autorizacion[0].FECHA_INICIO).isSame(FECHA_INICIAL)) return res.status(400).json({ message: "No puedes modificar la fecha de inicio del proyecto" });
        else if (proyectos[0].State === 'En espera' && proyectos[0].modificado) {
            const diasDiferencia = moment(autorizacion[0].FECHA_INICIO).diff(FECHA_ACTUAL, 'days');
            if (diasDiferencia === 0) return res.status(400).json({ message: "Tienes que dejar un dia minimo para iniciar al proyecto" });
        }

        let diasEntregas = 0;
        let diasIteracion = 0;

        const responses = await Promise.all(entregas.map(async (entrega, index) => {
            const entregaActual = moment(entrega.StartTime);
            const entregaSiguiente = moment(entregas[index + 1]?.StartTime);
            const fechaFinalEntregaActual = moment(entrega.EndTime).add(1, 'second');
            const fechaInicialEntregaSiguiente = entregaSiguiente;
            const entregaFinal = moment(entrega.EndTime);
            let diasEntregaActual = moment(entrega.EndTime).diff(moment(entrega.StartTime), 'days') + 1;
            diasEntregas += moment(entrega.EndTime).diff(moment(entrega.StartTime), 'days') + 1;

            if (entrega.modificado && entrega.State === 'Finalizado') return { error: true, message: `No puedes modificar una entrega finalizada ${entrega.Title}` };
            const autorizacion = await obtenerFechasConfigID("ENTREGAS", entrega.Id_entrega);

            if (entrega.modificado && entrega.State === 'En desarrollo' && !moment(autorizacion[0].FECHA_INICIO).isSame(entregaActual)) return { error: true, message: `No puedes modificar la fecha de inicio de ${entrega.Title}` };

            if (index === 0) {
                if (!entregaActual.isSame(FECHA_INICIAL)) return { error: true, message: `La fecha inicial de la primera entrega debe ser igual a la fecha inicial del proyecto ${entrega.Title}` };
                if (!fechaFinalEntregaActual.isSame(fechaInicialEntregaSiguiente)) return { error: true, message: `Las fechas no son consecutivas en las entregas ${entrega.Title}` };
            } else if (index > 0 && index < (entregas.length - 1)) {
                if (!fechaFinalEntregaActual.isSame(fechaInicialEntregaSiguiente)) return { error: true, message: `Las fechas no son consecutivas en las entregas ${entrega.Title}` };
            } else {
                if (!entregaFinal.isSame(FECHA_FINAL)) return { error: true, message: `La fecha final de la ultima entrega debe ser igual a la fecha final del proyecto ${entrega.Title}` };
            }



            let counterxentrega = 0;


            const iteracionesPromises = await Promise.all(iteraciones.map(async (iteracion, index) => {

                if (iteracion.Id_entrega === entrega.Id_entrega) {
                    diasIteracion += moment(iteracion.EndTime).diff(moment(iteracion.StartTime), 'days') + 1;
                    const iteracionActual = moment(iteracion.StartTime);
                    if (iteraciones[index + 1]?.Id_entrega === entrega.Id_entrega) {

                        const iteracionSiguiente = moment(iteraciones[index + 1]?.StartTime);
                        const fechaFinalIteracionActual = moment(iteracion.EndTime).add(1, 'second');
                        const fechaInicialIteracionSiguiente = iteracionSiguiente;


                        if (counterxentrega === 0) {
                            if (!iteracionActual.isSame(entrega.StartTime)) return { errorIt: true, message: `La fecha inicial de la primera iteracion debe ser igual a la fecha inicial de la entrega ${iteracion.Title}` };
                            if (!fechaFinalIteracionActual.isSame(fechaInicialIteracionSiguiente)) return { errorIt: true, message: `Las fechas no son consecutivas en las iteraciones ${iteracion.Title}` };
                        } else {
                            if (!fechaFinalIteracionActual.isSame(fechaInicialIteracionSiguiente)) return { errorIt: true, message: `Las fechas no son consecutivas en las iteraciones ${iteracion.Title}` };
                        }

                        counterxentrega++;

                    } else if ((iteraciones[index + 1]?.Id_entrega !== entrega.Id_entrega) && counterxentrega > 0) {
                        const iteracionFinal = moment(iteracion.EndTime);
                        const fechafinalEntrega = moment(entrega.EndTime)
                        if (!iteracionFinal.isSame(fechafinalEntrega)) return { errorIt: true, message: `La fecha final de la ultima iteracion debe ser igual a la fecha final de la entrega ${iteracion.Title}` };

                        counterxentrega = 0;
                    }


                    const duracionIteracion = moment(iteracion.EndTime).diff(moment(iteracion.StartTime), 'days') + 1;
                    if (duracionIteracion < 7) return { errorIt: true, message: `Las iteraciones no pueden durar menos de 7 días ${iteracion.Title}` };




                }
                if (iteracion.modificado && (iteracion.State === 'Finalizado' || iteracion.State === 'En desarrollo')) return { errorIt: true, message: `No puedes modificar una iteracion finalizada o en desarrollo ${iteracion.Title}` };

                return { errorIt: false };
            }));

            //const iteracionesResponses = await Promise.all(iteracionesPromises);

            const iteracionErrorResponse = iteracionesPromises.find(response => response.errorIt === true);
            if (iteracionErrorResponse) {
                // Si hay un error en alguna iteración, devuelve la respuesta de error
                return { error: true, message: iteracionErrorResponse.message };
            }

            if (diasIteracion !== diasEntregaActual) {
                diasIteracion = 0;
                return { error: true, message: "Los dias totales de iteracion no concuerdan" };
            }

            diasIteracion = 0;

            return { error: false };
        }));
        //console.log(responses);
        if (diasDiferenciaProyecto !== diasEntregas) return res.status(400).json({ message: "Los dias totales de entrega no concuerdan" });

        const errorResponse = responses.find(response => response.error === true);

        if (errorResponse) {
            //console.log(errorResponse.message);
            return res.status(400).json({ message: errorResponse.message });
        }
        const tiposDeFecha = [proyectos, entregas, iteraciones];
        console.log("llegue 0")

        const success = await Promise.all(tiposDeFecha.map(async (tipo, index) => {
            return await Promise.all(tipo.map(async (objeto) => {
                if (index === 0) {
                    const actualizarFecha = await ActualizarFechasQuery('proyectos', objeto, objeto.Id_project);
                    return actualizarFecha.success;
                }
                if (index === 1) {
                    const actualizarFecha = await ActualizarFechasQuery('entregas', objeto, objeto.Id_entrega);
                    return actualizarFecha.success;
                }
                if (index === 2) {
                    const actualizarFecha = await ActualizarFechasQuery('iteraciones', objeto, objeto.Id_iteracion);
                    return actualizarFecha.success;
                }
            }));
        }));

        const someFailed = success.some(tipoSuccessArray => tipoSuccessArray.includes(false));
        if (someFailed) return res.status(400).json({ message: 'Algunas actualizaciones fallaron' });

        const correosNotificacion = await IdUsuarios(proyectos[0].Id_project);
        if (correosNotificacion.participantes === 0) return res.status(500).json({ message: 'Error al enviar la notificación' });
        const idParticipantes = correosNotificacion.participantes;


        await Promise.all(idParticipantes.map(async (id) => {
            //meter la notificacion a la base
            const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
            const meterNotificacion = registrarNotificacion(
                id.ID_USUARIO,
                "Se han actualizado las fechas del proyecto, revisalas en el calendario",
                4,
                FECHA_ACTUAL_REGISTRAR
            )
            if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

            const correoParticipante = await getUser(id.ID_USUARIO);
            try {
                await sendemailConfig(proyectos[0].Title, correoParticipante[0].CORREO);
            } finally { }

        }));

        res.status(200).json({ message: "Fechas cambiadas" })

    } catch (error) {
        //console.log(error);
        res.status(500).json({ message: "Error inesperado, intentalo nuevamente" });
    }
}

export const deleteTask = async (req, res) => {
    const task = await getTask(req.body.ID);
    const deleteTask = await DeleteTask(req.body.ID);
    if (!deleteTask.success) return res.status(400).json({ message: "Error al crear la tarea" });


    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
    const meterNotificacion = registrarNotificacion(
        id_usuario,
        `Se ha eliminado la tarea ${req.body.NOMBRE}`,
        3,
        FECHA_ACTUAL_REGISTRAR
    )
    if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

    const correoParticipante = await getUser(id_usuario);
    try {
        await sendemailDeleteTask(task.task[0].NOMBRE, correoParticipante, task.task[0].DESCRIPCION);
    } finally { }

    return res.status(200).json({ message: "Tarea Eliminada Correctamente" });
    //res.json(taskFound)
}

export const updateTask = async (req, res) => {
    //si hubiera id_usuario
    const updTask = await UpdateTask(req.body.ID, req.body.NOMBRE, req.body.DESCRIPCION, req.body.ESTADO_DESARROLLO, req.body.FECHA_INICIO, req.body.FECHA_MAX_TERMINO);
    if (!updTask.success) return res.status(400).json({ message: "Error al actualizar la tarea" });

    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
    const meterNotificacion = registrarNotificacion(
        id_usuario,
        `Se ha actualizado la tarea ${req.body.NOMBRE}`,
        2,
        FECHA_ACTUAL_REGISTRAR
    )
    if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

    const correoParticipante = await getUser(id_usuario);
    try {
        await sendemailUpdateTask(req.body.NOMBRE, correoParticipante, req.body.DESCRIPCION, req.body.ESTADO_DESARROLLO, req.body.FECHA_INICIO, req.body.FECHA_MAX_TERMINO);
    } finally { }
    return res.status(200).json({ message: "Tarea actualizada correctamente" });
}

export const updateTaskState = async (req, res) => {
    const updTask = await ActualizarEstadoTareas(req.body.ESTADO_DESARROLLO, req.body.ID);
    if (!updTask.success) return res.status(400).json({ message: "Error al actualizar el estado de la tarea" });
    return res.status(200).json({ message: "Estado de la tarea actualizado correctamente" });
}

export const createTask = async (req, res) => {
    const { NOMBRE, DESCRIPCION, FECHA_INICIO, HORAINICIO, HORAMAXIMA, FECHA_MAX_TERMINO, iteracionactual, ID_USUARIO, ID_REQUERIMIENTO, ROLPARTICIPANTE, ID_TAREA_DEPENDIENTE, CORREO } = req.body
    //console.log(req.body);
    const FECHA_ACTUAL_SIS = moment().format('YYYY-MM-DD HH:mm:ss');
    const FECHA_ACTUAL = moment.utc(FECHA_ACTUAL_SIS);
    try {
        const HORAINICIO_TAREA = moment(HORAINICIO, 'HH:mm:ss'); const HORAMAXIMA_TAREA = moment(HORAMAXIMA, 'HH:mm:ss');
        const FECHA_INICIO_TAREA = moment.utc(FECHA_INICIO); const FECHA_MAX_TERMINO_TAREA = moment.utc(FECHA_MAX_TERMINO);
        const FECHA_INICIO_ITERACION = moment.utc(iteracionactual.FECHA_INICIO); const FECHA_TERMINO_ITERACION = moment.utc(iteracionactual.FECHA_TERMINO);

        const FECHA_INICIO_COMPLETA = FECHA_INICIO_TAREA.clone().hours(HORAINICIO_TAREA.hours()).minutes(HORAINICIO_TAREA.minutes()).seconds(HORAINICIO_TAREA.seconds());
        const FECHA_MAXIMA_COMPLETA = FECHA_MAX_TERMINO_TAREA.clone().hours(HORAMAXIMA_TAREA.hours()).minutes(HORAMAXIMA_TAREA.minutes()).seconds(HORAMAXIMA_TAREA.seconds());

        //ITERACION VERIFICAR
        if (FECHA_INICIO_COMPLETA.isBefore(FECHA_INICIO_ITERACION)) return res.status(400).json({ message: "La fecha inicial debe correponder a la iteracion actual" });
        if (FECHA_MAXIMA_COMPLETA.isAfter(FECHA_TERMINO_ITERACION)) return res.status(400).json({ message: "La fecha max debe correponder a la iteracion actual" });

        //FECHAS VERIFICAR
        if (FECHA_INICIO_COMPLETA.isBefore(FECHA_ACTUAL)) return res.status(400).json({ message: "Fecha inicial incorrecta" });
        if (FECHA_MAXIMA_COMPLETA.isBefore(FECHA_INICIO_COMPLETA)) return res.status(400).json({ message: "Fecha final maxima incorrecta" });

        if (ID_TAREA_DEPENDIENTE !== '0') {
            const tarea = await getTareaDependiente(ID_TAREA_DEPENDIENTE);
            if (!tarea.success) return res.status(500).json({ message: "Error al extraer la tarea" });
            const FECHA_INICIO_DEP = moment.utc(tarea.task[0].FECHA_INICIO);
            //const FECHA_MAX_TERMINO_DEP = moment.utc(tarea.task[0].FECHA_MAX_TERMINO);

            if (FECHA_INICIO_COMPLETA.isBefore(FECHA_INICIO_DEP)) return res.status(400).json({ message: "Fecha inicial de la dep incorrecta" });
        }
        const MINUTOS_DIFERENCIA = FECHA_MAXIMA_COMPLETA.diff(FECHA_INICIO_COMPLETA, 'minutes');
        if (MINUTOS_DIFERENCIA < 120) return res.status(400).json({ message: "Diferencia minimo de 2 horas entre el inicio y la entrega" });

        const REGISTRO_INICIO = moment(FECHA_INICIO_COMPLETA).format('YYYY-MM-DD HH:mm:ss');
        const REGISTRO_MAX = moment(FECHA_MAXIMA_COMPLETA).format('YYYY-MM-DD HH:mm:ss');

        //console.log("Controller function createTask");
        const tareacreada = await CrearTarea(NOMBRE, DESCRIPCION, REGISTRO_INICIO, REGISTRO_MAX, iteracionactual.ID, ID_USUARIO, ID_REQUERIMIENTO, ROLPARTICIPANTE, ID_TAREA_DEPENDIENTE);
        if (!tareacreada.success) return res.status(400).json({ message: "Error al crear la tarea" });

        console.log("Tarea creada")
        const usuario = await getUser(ID_USUARIO);
        const registro = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');
        const meterNotificacion = registrarNotificacion(
            ID_USUARIO,
            `Se te ha asignado una tarea ${NOMBRE}`,
            1,
            registro
        )
        if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });
        console.log("Noti enviado")

        const emailsendend = await sendemailTask(usuario[0].CORREO, NOMBRE, DESCRIPCION, REGISTRO_INICIO, REGISTRO_MAX, ROLPARTICIPANTE);
        if (!emailsendend) return res.status(400).json({ message: "Error inesperado, intente nuevamente" })
        console.log("Email enviado")

        return res.status(200).json({ message: "Tarea creada con exito" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error inesperado, intentalo nuevamente" });
    }
}

export const addParticipant = async (req, res) => {
    const { CORREO, ID_PROYECTO } = req.body;
    try {
        const FECHA_ACTUAL = moment().tz(zonaHoraria);
        let REGISTRO_ACTUAL = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');
        const ES_CREADOR = false;
        const registrado = await verificarUnionCorreo(ID_PROYECTO, CORREO);
        if (!registrado.isRegister) return res.status(400).json({ message: "Usuario no registrado en el sistema" })
        if (registrado.success) return res.status(400).json({ message: "Ya esta participando en el proyecto" })
        const numeroParticipantes = await verificarNumeroParticipantes(ID_PROYECTO);
        if (!numeroParticipantes.success) return res.status(400).json({ message: "Numero maximo de participantes alcanzado" });


        if (numeroParticipantes.participantes.length === 8) {
            const actualizarCrystalVar = await actualizarCrystal(2, ID_PROYECTO);
            if (!actualizarCrystalVar.success) return res.status(500).json({ message: "Error al actualizar el crystal" });
        }


        const union = await agregarUsuario(REGISTRO_ACTUAL, ES_CREADOR, ID_PROYECTO, registrado.ID_USUARIO);
        if (!union.success) return res.status(500).json({ message: "Usuario no agregado con exito" });
        const FECHAS_PROYECTO = await obtenerFechasID("PROYECTOS", ID_PROYECTO);
        const meterNotificacion = registrarNotificacion(
            registrado.ID_USUARIO,
            `Se te ha añadido a un proyecto, visualízalo en tu panel`,
            8,
            REGISTRO_ACTUAL
        )
        if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });
        const emailsendend = await sendemailAdd(CORREO, FECHAS_PROYECTO[0]);
        if (!emailsendend) return res.status(400).json({ message: "Error inesperado, intente nuevamente" })

        return res.status(200).json({ message: "Enlazado a proyecto correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error inesperado, intentalo nuevamente" });
    }
}

export const deleteParticipant = async (req, res) => {
    const { ID, ID_PROYECTO } = req.body;
    try {
        const numeroParticipantes = await verificarNumeroParticipantes(ID_PROYECTO);
        if (!numeroParticipantes.success) return res.status(400).json({ message: "Numero maximo de participantes alcanzado" });

        const eliminado = await eliminarParticipante(ID_PROYECTO, ID);
        if (!eliminado.success) return res.status(500).json({ message: "Error al eliminar al participante" });
        if (numeroParticipantes.participantes.length === 9) {
            const actualizarCrystalVar = await actualizarCrystal(1, ID_PROYECTO);
            if (!actualizarCrystalVar.success) return res.status(500).json({ message: "Error al actualizar el crystal" });
        }
        return res.status(200).json({ message: "Usuario eliminado con exito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error inesperado, intentalo nuevamente" });
    }
}

export const delegarParticipant = async (req, res) => {
    const { ID, ID_PROYECTO, ID_admin } = req.body;
    try {
        const delegado = await delegarParticipante(ID_PROYECTO, ID, ID_admin);
        if (!delegado.success) return res.status(500).json({ message: "Error al delegar al participante" });
        const ID_PRO = Number(ID_PROYECTO);

        const payload = {
            ID_PROYECTO: ID_PRO,
            role: 'participant'
        };
        const projectToken = await createProjectToken(payload);

        const namecookie = `Proyecto${ID_PRO}`;
        res.cookie(namecookie, projectToken);
        return res.status(200).json({ message: "Usuario ascendido con exito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error inesperado, intentalo nuevamente" });
    }
}

export const ascenderParticipant = async (req, res) => {
    const { ID, ID_PROYECTO, ID_admin } = req.body;
    try {
        const delegado = await ascenderParticipante(ID_PROYECTO, ID);
        if (!delegado.success) return res.status(500).json({ message: "Error al ascender al participante" });
        return res.status(200).json({ message: "Usuario ascendido con exito" });
    } catch (error) {
        res.status(500).json({ message: "Error inesperado, intentalo nuevamente" });
    }
}

export const degradarParticipant = async (req, res) => {
    const { ID, ID_PROYECTO, ID_admin } = req.body;
    try {
        const delegado = await degradarParticipante(ID_PROYECTO, ID);
        if (!delegado.success) return res.status(500).json({ message: "Error al degradar al participante" });
        return res.status(200).json({ message: "Usuario degradado con exito" });
    } catch (error) {
        res.status(500).json({ message: "Error inesperado, intentalo nuevamente" });
    }
}

export const deleteProject = async (req, res) => {
    const { ID_PROYECTO } = req.body;
    try {
        const ID_PRO = Number(ID_PROYECTO);
        const namecookie = `Proyecto${ID_PRO}`;
        res.cookie(namecookie, "", { expires: new Date(0) });

        const correosNotificacion = await IdUsuarios(ID_PROYECTO);
        const idParticipantes = correosNotificacion.participantes;
        const FECHA_ACTUAL = moment().tz(zonaHoraria);

        await Promise.all(idParticipantes.map(async (id) => {
            const projectinfo = await getProjectName(ID_PROYECTO);
            const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
            const meterNotificacion = registrarNotificacion(
                id.ID_USUARIO,
                `Tu proyecto ${projectinfo[0].NOMBRE} ha sido eliminado`,
                10,
                FECHA_ACTUAL_REGISTRAR
            )
            if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

            const correoParticipante = await getUser(id.ID_USUARIO);
            await sendemailDeleteProject(projectinfo[0].NOMBRE, correoParticipante[0].CORREO, projectinfo[0].OBJETIVO, projectinfo[0].DESCRIPCION_GNRL);
        }));
        const eliminado = await eliminarProyecto(ID_PROYECTO);
        //console.log(eliminado)
        if (!eliminado.success) return res.status(500).json({ message: "Error al eliminar proyecto" });


        return res.status(200).json({ message: "Proyecto eliminado, redirigiendo" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error inesperado, intentalo nuevamente" });
    }
}

export const activarTareasInactivas = async (req, res) => {
    const ESTADO = ["En espera", "En desarrollo", "Finalizado"];
    const ESTADOTAREA = ["En espera", "En desarrollo", "Atrasada"];
    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    const FECHAS_PROYECTO = await obtenerFechas("PROYECTOS");
    const FECHAS_ENTREGAS = await obtenerFechas("ENTREGAS");
    const FECHAS_ITERACIONES = await obtenerFechas("ITERACIONES");
    const FECHAS_TAREAS = await obtenerFechasTareas("TAREAS");
    const TAREAS_DEPENDIENTES = await obtenerTareasDep();
    const tiposDeFecha = [FECHAS_PROYECTO, FECHAS_ENTREGAS, FECHAS_ITERACIONES];

    await Promise.all(tiposDeFecha.map(async (fechas, index) => {
        //console.log(`Fechas del tipo ${index + 1}:`);
        await Promise.all(fechas.map(async (fecha) => {
            let fechaInicial = moment(fecha.FECHA_INICIO).tz(zonaHoraria);
            let fechaFinal = moment(fecha.FECHA_TERMINO).tz(zonaHoraria);
            if (FECHA_ACTUAL.isAfter(fechaInicial) && (fecha.ESTADO) === "En espera") {
                const actualizar = await ActualizarEstado(ESTADO[1], index, fecha.ID);
                if (fechas === FECHAS_PROYECTO) {
                    //console.log(`notificacion de inicio de proyecto`);
                    const correosNotificacion = await IdUsuarios(fecha.ID);
                    const idParticipantes = correosNotificacion.participantes;

                    await Promise.all(idParticipantes.map(async (id) => {
                        const projectinfo = await getProjectName(fecha.ID);
                        const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
                        const meterNotificacion = registrarNotificacion(
                            id.ID_USUARIO,
                            `Ha iniciado tu proyecto ${projectinfo[0].NOMBRE}, date una vuelta`,
                            5,
                            FECHA_ACTUAL_REGISTRAR
                        )
                        if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

                        const correoParticipante = await getUser(id.ID_USUARIO);
                        try {
                            await sendemailStartProject(projectinfo[0].NOMBRE, correoParticipante[0].CORREO, projectinfo[0].OBJETIVO, projectinfo[0].DESCRIPCION_GNRL);
                        } catch(err) { }
                    }));
                }
            }
            if (FECHA_ACTUAL.isAfter(fechaFinal) && (fecha.ESTADO) === "En desarrollo") {
                const actualizar = await ActualizarEstado(ESTADO[2], index, fecha.ID);
                if (fechas === FECHAS_PROYECTO) {
                    //console.log("notificacion de termino de proyecto");
                    const correosNotificacion = await IdUsuarios(fecha.ID);
                    const idParticipantes = correosNotificacion.participantes;

                    await Promise.all(idParticipantes.map(async (id) => {
                        const projectinfo = await getProjectName(fecha.ID);
                        const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
                        const meterNotificacion = registrarNotificacion(
                            id.ID_USUARIO,
                            `Ha finalizado tu proyecto ${projectinfo[0].NOMBRE}`,
                            6,
                            FECHA_ACTUAL_REGISTRAR
                        )
                        if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

                        const correoParticipante = await getUser(id.ID_USUARIO);
                        try {
                            await sendemailEndProject(projectinfo[0].NOMBRE, correoParticipante[0].CORREO, projectinfo[0].OBJETIVO, projectinfo[0].DESCRIPCION_GNRL);
                        } catch(err) { }
                    }));
                } if (fechas === FECHAS_ITERACIONES) {
                    const idProyecto = await getProjectWithIter(fecha.ID);
                    const correosNotificacion = await IdUsuarios(idProyecto[0].ProyectoID);
                    const idParticipantes = correosNotificacion.participantes;


                    await Promise.all(idParticipantes.map(async (id) => {
                        const projectinfo = await getProjectName(idProyecto[0].ProyectoID);
                        const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
                        const meterNotificacion = registrarNotificacion(
                            id.ID_USUARIO,
                            `Ha cambiado el estado de tu proyecto, date una vuelta`,
                            7,
                            FECHA_ACTUAL_REGISTRAR
                        )
                        if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

                        const correoParticipante = await getUser(id.ID_USUARIO);
                        try {
                            await sendemailFaseProject(projectinfo[0].NOMBRE, correoParticipante[0].CORREO, projectinfo[0].OBJETIVO, projectinfo[0].DESCRIPCION_GNRL);
                        } catch(err) { }
                    }));
                }
                if (fechas === FECHAS_ENTREGAS) {
                    const idProyecto = await getProjectWithEntrega(fecha.ID);
                    const correosNotificacion = await IdUsuarios(idProyecto[0].ProyectoID);
                    const idParticipantes = correosNotificacion.participantes;


                    await Promise.all(idParticipantes.map(async (id) => {
                        const projectinfo = await getProjectName(idProyecto[0].ProyectoID);
                        const FECHA_ACTUAL_REGISTRAR = FECHA_ACTUAL.format('YYYY-MM-DD HH:mm:ss');
                        const meterNotificacion = registrarNotificacion(
                            id.ID_USUARIO,
                            `Ha cambiado el estado de tu proyecto, date una vuelta`,
                            7,
                            FECHA_ACTUAL_REGISTRAR
                        )
                        if (!meterNotificacion) return res.status(500).json({ message: 'Error al registrar la notificación' });

                        const correoParticipante = await getUser(id.ID_USUARIO);
                        try {
                            await sendemailFaseProject(projectinfo[0].NOMBRE, correoParticipante[0].CORREO, projectinfo[0].OBJETIVO, projectinfo[0].DESCRIPCION_GNRL);
                        } catch(err) { }

                    }));
                }
            }
        }));
    }));

    await Promise.all(FECHAS_TAREAS.map(async (fecha) => {
        let fechaInicial = moment(fecha.FECHA_INICIO).tz(zonaHoraria);
        let fechaFinalMaxima = moment(fecha.FECHA_MAX_TERMINO).tz(zonaHoraria);
        if (FECHA_ACTUAL.isAfter(fechaInicial) && FECHA_ACTUAL.isAfter(fechaFinalMaxima) && (fecha.ESTADO_DESARROLLO) === "En espera") {
            const actualizar = await ActualizarEstadoTareas(ESTADOTAREA[2], fecha.ID);
        }
        if (FECHA_ACTUAL.isAfter(fechaInicial) && FECHA_ACTUAL.isBefore(fechaFinalMaxima) && (fecha.ESTADO_DESARROLLO) === "En espera") {
            const actualizar = await ActualizarEstadoTareas(ESTADOTAREA[1], fecha.ID);
        }
        if (FECHA_ACTUAL.isAfter(fechaFinalMaxima) && (fecha.ESTADO_DESARROLLO) === "En desarrollo") {
            const actualizar = await ActualizarEstadoTareas(ESTADOTAREA[2], fecha.ID);
        }
    }));

    await Promise.all(TAREAS_DEPENDIENTES.map(async (TAREAS) => {
        if (TAREAS.TAREA_DEP === "En revision" || TAREAS.TAREA_DEP === "Cerrada") {
            const actualizar = await ActualizarEstadoTareas(ESTADOTAREA[0], TAREAS.ID_TAREA_SUB);
        }
    }))


    //probar despues
    await Promise.all(FECHAS_PROYECTO.map(async (PROYECTO) => {
        let fechaFinal = moment(PROYECTO.FECHA_TERMINO).tz(zonaHoraria);
        const DIAS_PROYECTO = FECHA_ACTUAL.diff(fechaFinal, 'days') + 1;
        //console.log(DIAS_PROYECTO, fechaFinal);
        if (PROYECTO.ESTADO === "Finalizado" && DIAS_PROYECTO >= 30) {
            //const actualizar = await eliminarProyecto(PROYECTO.ID);
        }
    }))

    await Promise.all(FECHAS_ITERACIONES.map(async (ITERACION) => {
        let fechaFinal = moment(ITERACION.FECHA_TERMINO).tz(zonaHoraria);
        const DIAS_PROYECTO = FECHA_ACTUAL.diff(fechaFinal, 'days') + 1;
        //console.log(DIAS_PROYECTO, fechaFinal);

        if (ITERACION.ESTADO === "Finalizado" && DIAS_PROYECTO >= 30) {
            //console.log(DIAS_PROYECTO, fechaFinal, ITERACION.ID);
            const actualizar = await eliminarChats(ITERACION.ID);
        }
    }))

    console.log("Im alive");
    setTimeout(activarTareasInactivas, 60 * 1000);
}

export const agregarRequerimiento = async (req, res) => {
    try {
        const { OBJETIVO, DESCRIPCION, TIPO, ID_ENTREGA } = req.body;
        //console.log(req.body);
        const agregar_requerimiento = await AgregarRequerimiento(OBJETIVO, DESCRIPCION, TIPO, ID_ENTREGA);
        //console.log("mor2")
        if (!agregar_requerimiento.success) res.status(500).json({ mensaje: "Error al agregar el requerimiento" });
        //console.log("moru3")

        return res.status(200).json({ message: "Requerimiento creado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error inesperado, intentalo nuevamente" });
    }
}

export const agregarMensaje = async (req, res) => {
    try {
        const { CONTENIDO, FECHA, HORA, USUARIO, ITERACION } = req.body;
        const agregar_mensaje = await AgregarMensaje(CONTENIDO, FECHA, HORA, USUARIO, ITERACION);
        console.log("agregarMensaje pc");
        if (!agregar_mensaje.success) res.status(500).json({ mensaje: "Error al enviar mensaje" });
        return res.status(200).json({ message: "Mensaje enviado con éxito" });
    } catch (error) {
        res.status(500).json({ message: `el error es: ${error.message}` });
    }
}

export const getMessages = async (req, res) => {
    const { ID_ITERACION } = req.body;
    try {
        const messages = await GetMessages(ID_ITERACION);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al intentar obtener mensajes" })
    }
}