import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestVerify } from "../requests/auth.js";
import { requestCreate, requestJoin, requestPermissions, requestgetProject, 
  requestAddRequirement, requestCreateTask, requestAdd,requestDelete, 
  requestAddMessage, requestMessages, requestDeleteTask, requestUpdateTask, requestUpdateTState,
  requestTasksProject,requestConfig,
  requestDelegar,
  requestDeleteProject} from "../requests/projectReq.js";
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
  const {setUser, setIsAuthenticated ,setLoading, logout} = useAuth();

  const [IsParticipant, setIsParticipant] = useState(true);
  const [userRole, setUserRole] = useState(false);

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
  const [chaterrors, setChatErrors] = useState([]);

  const [entregasproject,  setEntregasProject] = useState([]);
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
/*
  useEffect(() => {
    let events = [];
    
    fechasproject?.forEach(project => {
      events.push({
        Subject: `Inicio del Proyecto: ${project.NOMBRE}`,  
        StartTime: new Date(project.FECHA_INICIO),
        EndTime: new Date(project.FECHA_TERMINO),
        IsAllDay: true
      });
    });


    fechasentregas?.forEach((entrega, index) => {
      events.push({
        Subject: `Entrega ${index + 1}`,
        StartTime: new Date(entrega.FECHA_INICIO),
        EndTime: new Date(entrega.FECHA_TERMINO),
        IsAllDay: true
      });
    });


    fechasiteraciones?.forEach((iteracionesPorEntrega, index) => {
      iteracionesPorEntrega.forEach((iteracion, subIndex) => {
        events.push({
          Subject: `Iteración ${subIndex + 1} de Entrega ${index + 1}`,
          StartTime: new Date(iteracion.FECHA_INICIO),
          EndTime: new Date(iteracion.FECHA_TERMINO),
          IsAllDay: true
        });
      });
    });
    console.log(events);
    setScheduleData(events);
    
  }, [fechasproject, fechasentregas, fechasiteraciones]);
*/
  const createTask = async (Task) => {
    try {
      const res = await requestCreateTask(Task);
      setMessage(res.data.message);
      swal({
        title: 'Asignacion de tarea',
        text: res.data.message,
        icon: (res.status === 200 ? 'success' : (res.status === 400 ? 'warning' : 'error')),
        button: 'Aceptar',
      });
      console.log(res);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
        console.log(error.response.data.message);
        
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const deleteTask = async (Task) => {
    try{
      console.log(Task);
      const res = await requestDeleteTask(Task);
      console.log(res.data.message);
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const deleteProjectFunction = async (id) => {
    try{
      console.log(id);
      const res = await requestDeleteProject(id);
      setMessage(res.data.message);
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const updateTaskState = async (Task) => {
    try {
      const res = await requestUpdateTState(Task);
      console.log(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const updateTask = async (Task) => {
    try{
      const res = await requestUpdateTask(Task);
      console.log(res.data.message);
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const configProyect = async (fechas) => {
    try {
      const res = await requestConfig(fechas);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }


  const getTasksProject = async (project) => {
    try{
      const res = await requestTasksProject(project);
      setEntregasProject(res.data);
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const create = async (project) => {
    try {
      const res = await requestCreate(project);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  };

  const createMessages = async (message) => {
    try{
      const res = await requestAddMessage(message);
      console.log(res.data); 
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setProjecterrors(error.response.data.message);
      }else{
        setProjecterrors("Error del servidor");
      }
    }
  };

  const getMessages = async (iteracion) => {
    try {
      //const cookies = Cookies.get();
      //console.log('iteracion pcontext: ' + iteracion.ID_ITERACION);
      console.log(iteracion);
      const res = await requestMessages(iteracion);
      console.log('pcontext: ' + res);
      setMessagesChat(res.data);
      //setIsCreated(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  };

  const joinProject = async (joinable) => {
    try {
      const res = await requestJoin(joinable);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const addParticipant = async (participant) => {
    try {
      const res = await requestAdd(participant);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const createRequirements = async (project) => {
    try {
      const res = await requestAddRequirement(project);
      console.log(res.data);
      swal({
        title: 'Requerimiento Agregado',
        text: res.data.message,
        icon: (res.data.status === "OK" ? 'success' : 'error'),
        button: 'Aceptar',
      });
      //setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const getProject = async (project) => {
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
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const deleteParticipant = async (id) => {
    try {
      const res = await requestDelete(id);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const delegarParticipant = async (id) => {
    try {
      const res = await requestDelegar(id);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
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
          setProjecterrors(error.response.data.message);
        } else {
          setProjecterrors("Error del servidor");
        }
      }
    }
  }

   const vaciarProject = async () =>{
    try {
      setIsParticipant(true)
        setUserRole(false)
        setFechasproject([])
        setFechasentregas([])
        setFechasiteraciones([])
        setTareas([])
        setScheduleData([])
        setTareasKanban([])
        setEntregaactual([])
        setiteracionactual([])
        setRequerimientos([])
        setMessagesChat([])
        setEntregasProject([])
    } catch (error) {
      setProjecterrors("Error del servidor");
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
        message,projecterrors,
        
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
        IsParticipant,
        
        requerimientos,tareas,
        
        chaterrors,
        messagesChat,

        setProjecterrors,
        setMessage,setIsParticipant, setScheduleData,

        create,
        configProyect,
        deleteParticipant,
        joinProject,
        getProject,
        getPermissions,
        createRequirements,
        createTask,
        addParticipant,
        delegarParticipant,
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