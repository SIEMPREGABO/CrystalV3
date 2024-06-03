import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestVerify } from "../requests/auth.js";
import {
  requestCreate, requestJoin, requestPermissions, requestgetProject,
  requestAddRequirement, requestCreateTask, requestAdd, requestDelete,
  requestAddMessage, requestMessages, requestDeleteTask, requestUpdateTask, requestUpdateTState,
  requestTasksProject, requestConfig,
  requestDelegar,
  requestDeleteProject,
  requestDegradar,
  requestAscender
} from "../requests/projectReq.js";
import Cookies from "js-cookie";
import { useAuth } from "./authContext.js";
import swal from 'sweetalert';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useAuth must be used with in a ProjectProvider");
  return context;
};

export const ProjectProvider = ({ children }) => {
  const { setUser, setIsAuthenticated, setLoading, logout } = useAuth();

  const [IsParticipant, setIsParticipant] = useState(true);
  const [userRole, setUserRole] = useState(false);
  const [twoAdmins, setTwoAdmins] = useState(false);

  const [message, setMessage] = useState([]);
  const [projecterrors, setProjecterrors] = useState([]);

  const [participants, setParticipants] = useState([]);
  const [fechasproject, setFechasproject] = useState([]);
  const [fechasentregas, setFechasentregas] = useState([]);
  const [fechasiteraciones, setFechasiteraciones] = useState([]);

  const [tareas, setTareas] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  const [tareasKanban, setTareasKanban] = useState([]);
  const [entregaactual, setEntregaactual] = useState([]);
  const [iteracionactual, setiteracionactual] = useState([]);
  const [requerimientos, setRequerimientos] = useState([]);
  const [messagesChat, setMessagesChat] = useState([]);

  const [entregasproject, setEntregasProject] = useState([]);
  const [projectInfo, setProjectInfo] = useState([]);

  useEffect(() => {
    if (message.length > 0) {
      const timer = setTimeout(() => {
        setMessage([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (projecterrors.length > 0) {
      const timer = setTimeout(() => {
        setProjecterrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [projecterrors, message]);

  const createTask = async (Task) => {
    try {
      const res = await requestCreateTask(Task);
      //setMessage(res.data.message);
      swal({
        title: 'Asignación de tarea',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
      //console.log(res);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Asignación de tarea',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        setProjecterrors(error.response.data.message);
        console.log(error.response.data.message);

      } else {
        swal({
          title: 'Asignación de tarea',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        setProjecterrors("Error del servidor");
      }
    }
  }

  const deleteTask = async (Task) => {
    try {
      //console.log(Task);
      const res = await requestDeleteTask(Task);
      swal({
        title: 'Eliminación de tarea',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
      //console.log(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Eliminación de tarea',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: 'Eliminación de tarea',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }

  const deleteProjectFunction = async (id) => {
    try {
      swal({
        title: "Eliminar proyecto",
        text: "¿Quieres eliminar el proyecto?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            const res = await requestDeleteProject(id);
            swal({
              title: "Eliminar proyecto",
              text: res.data.message,
              icon: 'success',
              button: 'Aceptar',
            });
          }
        });
      //setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: "Eliminar proyecto",
          text: error.response.data.message,
          icon: 'success',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: "Eliminar proyecto",
          text: "Error del servidor",
          icon: 'success',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }

  const updateTaskState = async (Task) => {
    try {
      const res = await requestUpdateTState(Task);
      console.log(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Actualizar tarea',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Actualizar tarea',
          text: "Error del servidor",
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const updateTask = async (Task) => {
    try {
      const res = await requestUpdateTask(Task);
      //console.log(res.data.message);
      swal({
        title: 'Actualizar tarea',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Actualizar tarea',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Actualizar tarea',
          text: "Error del servidor",
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const configProyect = async (fechas) => {
    try {
      const res = await requestConfig(fechas);
      //setMessage(res.data.message);
      swal({
        title: 'Configurar Proyecto',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Configurar Proyecto',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //console.log(error.response.data.message);
      } else {
        swal({
          title: 'Configurar Proyecto',
          text: "Error del servidor",
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }


  const getTasksProject = async (project) => {
    try {
      const res = await requestTasksProject(project);
      setEntregasProject(res.data);
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Extraer tareas del proyecto',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Extraer tareas del proyecto',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const create = async (project) => {
    try {
      const res = await requestCreate(project);
      setMessage(res.data.message);
      swal({
        title: 'Crear proyecto',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Crear proyecto',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Crear Proyecto',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  };

  const createMessages = async (message) => {
    try {
      const res = await requestAddMessage(message);
      console.log(res.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Crear mensajes',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Crear mensajes',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  };

  const getMessages = async (iteracion) => {
    try {
      //const cookies = Cookies.get();
      //console.log('iteracion pcontext: ' + iteracion.ID_ITERACION);
      //console.log(iteracion);
      const res = await requestMessages(iteracion);
      //console.log('pcontext: ' + res);
      setMessagesChat(res.data);
      //setIsCreated(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Extraer mensajes',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Extraer mensajes',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  };

  const joinProject = async (joinable) => {
    try {
      const res = await requestJoin(joinable);
      //setMessage(res.data.message);
      swal({
        title: 'Enlazar participante',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Enlazar participante',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Enlazar participante',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const addParticipant = async (participant) => {
    try {
      const res = await requestAdd(participant);
      //setMessage(res.data.message);
      swal({
        title: 'Agregar participante',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Agregar participante',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: 'Agregar participante',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }

  const createRequirements = async (project) => {
    try {
      const res = await requestAddRequirement(project);
      //console.log(res.data);
      swal({
        title: 'Crear Requerimiento',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
      //setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Crear Requerimiento',
          text: error.response.data.message,
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: 'Crear Requerimiento',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }

  const getProject = async (project) => {
    let counter = 0;
    try {
      const res = await requestgetProject(project);
      setParticipants(res.data.participants);
      setFechasproject(res.data.fechasProyecto);
      setFechasentregas(res.data.fechasEntregas);
      setFechasiteraciones(res.data.fechasIteraciones);
      setEntregaactual(res.data.entregaActual);
      setiteracionactual(res.data.iteracionactual);
      setRequerimientos(res.data.requerimientos);
      setTareas(res.data.tasks);
      setTareasKanban(res.data.tasksKanban);
      setProjectInfo(res.data.projectInfo);
      if(fechasproject[0].ID_CATEGORIA_CRYSTAL === 2 ){
        participants.map((participant)=>{
          if(participant.ROLE === 1){
            counter++;
          }
        })
      }
      if(counter === 2){
        setTwoAdmins(true);
        counter = 0;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
        swal({
          title: 'Extraer proyecto',
          text: error.response.data.message,
          icon: 'error',
          button: 'Aceptar',
        });
      } else {
        setProjecterrors("Error del servidor");
        swal({
          title: 'Extraer proyecto',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const deleteParticipant = async (id) => {
    try {
      //const res = await requestDelete(id);
      //setMessage(res.data.message);
      if(participants.length === 9 && twoAdmins){
        swal({
          title: 'Eliminar un participante',
          text: 'Degradar a un administrador para continuar',
          icon: 'warning',
          button: 'Aceptar',
        });
      }else{
        swal({
          title: "Eliminar un participante",
          text: "¿Quieres eliminar al participante?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then(async (willDelete) => {
            if (willDelete) {
              const res = await requestDelete(id);
              swal({
                title: 'Eliminar un participante',
                text: res.data.message,
                icon: 'success',
                button: 'Aceptar',
              });
            }
          });
      }
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Eliminar un participante',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: 'Eliminar un participante',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }


  const delegarParticipant = async (id) => {
    try {
      //const res = await requestDelegar(id);
      //setMessage(res.data.message);
      swal({
        title: "Delegar a un participante",
        text: "¿Quieres delegar al participante?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            const res = await requestDelegar(id);
            swal({
              title: 'Delegar a un participante',
              text: res.data.message,
              icon: 'success',
              button: 'Aceptar',
            });
          }
        });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Delegar a un participante',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: 'Delegar a un participante',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }

  const degradarParticipant = async (id) => {
    try {
      //const res = await requestDelegar(id);
      //setMessage(res.data.message);
      swal({
        title: "Degradar a un administrador",
        text: "¿Quieres degradar al administrador?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            const res = await requestDegradar(id);
            swal({
              title: "Degradar a un administrador",
              text: res.data.message,
              icon: 'success',
              button: 'Aceptar',
            });
          }
        });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: "Degradar a un administrador",
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: "Degradar a un administrador",
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }

  const ascenderParticipant = async (id) => {
    try {
      //const res = await requestDelegar(id);
      //setMessage(res.data.message);
      swal({
        title: "Ascender a un administrador",
        text: "¿Quieres ascender al administrador?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            const res = await requestAscender(id);
            swal({
              title: "Ascender a un administrador",
              text: res.data.message,
              icon: 'success',
              button: 'Aceptar',
            });
          }
        });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: "Ascender a un administrador",
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
        //setProjecterrors(error.response.data.message);
      } else {
        swal({
          title: "Ascender a un administrador",
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
        //setProjecterrors("Error del servidor");
      }
    }
  }


  const getPermissions = async (id) => {
    try {
      const nombreCookie = `Proyecto${id.ID}`;
      const Cookie = Cookies.get(nombreCookie);
      if (!Cookie) {
        setIsParticipant(false);
        return;
      }
      const Permission = await requestPermissions(id);
      if (!Permission.data) setIsParticipant(false);

      else {
        setIsParticipant(true);
        //setUserRole(false);
        if (Permission.data.role === "admin") {
          setUserRole(true);
        }
        await getProject(id);

      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsParticipant(false);
      } else {
        setIsParticipant(false);
        if (error.response && error.response.data && error.response.data.message) {
          //setProjecterrors(error.response.data.message);
          swal({
            title: 'Permisos del proyecto',
            text: error.response.data.message,
            icon: 'error',
            button: 'Aceptar',
          });
        } else {
          //setProjecterrors("Error del servidor");
          swal({
            title: 'Permisos del proyecto',
            text: 'Error del servidor',
            icon: 'error',
            button: 'Aceptar',
          });
        }
      }
    }
  }

  const vaciarProject = async () => {
    try {
      setIsParticipant(true);
      setUserRole(false);
      setFechasproject([]);
      setFechasentregas([]);
      setFechasiteraciones([]);
      setTareas([]);
      setScheduleData([]);
      setTareasKanban([]);
      setEntregaactual([]);
      setiteracionactual([]);
      setRequerimientos([]);
      setMessagesChat([]);
      setEntregasProject([]);
    } catch (error) {
      swal({
        title: 'Vaciar el proyecto',
        text: 'Error del servidor',
        icon: 'error',
        button: 'Aceptar',
      });
    }
  }

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await requestVerify(cookies.token);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        message, projecterrors,

        participants,
        entregasproject,
        tareasKanban,

        fechasproject,
        fechasentregas,
        fechasiteraciones,
        scheduleData,

        entregaactual,
        iteracionactual,
        projectInfo,

        userRole,
        IsParticipant,twoAdmins,

        requerimientos, tareas,

        chaterrors,
        messagesChat,

        setProjecterrors,
        setMessage, setIsParticipant, setScheduleData,

        create,
        configProyect,
        deleteParticipant,
        joinProject,
        getProject,
        getPermissions,
        createRequirements,
        createTask,
        addParticipant,
        delegarParticipant,degradarParticipant,ascenderParticipant,
        createMessages,
        getMessages,
        getTasksProject,
        setTareasKanban,
        deleteTask,
        updateTask,
        updateTaskState,
        deleteProjectFunction,
        vaciarProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;