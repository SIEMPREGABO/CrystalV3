import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import { useParams } from "react-router-dom";
import { KanbanComponent, ColumnsDirective, ColumnDirective, StackedHeadersDirective, StackedHeaderDirective } from '@syncfusion/ej2-react-kanban';
import '@syncfusion/ej2-base/styles/material.css';
import { L10n } from '@syncfusion/ej2-base';
import { useProject } from '../context/projectContext';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import styles from '../css/kanban.module.css';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, collabSchema, updateTaskSchema } from '../schemas/project';
import { useAuth } from '../context/authContext';
import { useStateContext } from '../context/Provider.js';
import { preventBatch } from '@syncfusion/ej2-react-grids/index.js';


L10n.load({
  'esp': {
    'kanban': {
      'items': 'tareas',
      'save': 'Guardar',
      'cancel': 'Cancelar',
      'delete': 'Eliminar',
      'yes': 'Sí',
      'no': 'No',
      'editTitle': 'Detalles de Tarea',
      'deleteTitle': 'Eliminar Tarea',
      'deleteContent': '¿Seguro que deseas eliminar esta tarea?',
      'noCard': 'Sin tareas por el momento',
      'required': 'El campo es requerido',
      'reset': 'limpiar'
    }
  }
});

const Kanban = () => {
  const { id } = useParams();
  const idint = parseInt(id, 10).toString();
  const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();
  const { tareasKanban, setTareasKanban, deleteTask, updateTask, updateTaskState, iteracionactual, entregaactual,
    fechasproject, setProjecterrors, setMessage, createTask, participants, requerimientos, tareas, getPermissions, userRole,
    addCollab, deleteCollab, iteraciones, entregas, setObjetivo, objetivoItAct, setObjItAct, setRetroalimentacion
  } = useProject();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [idTarea, setIDTarea] = useState(0);
  const [idK, setIdK] = useState("");
  const [nombreTarea, setNomTarea] = useState("Tarea Defecto ");
  const [descTarea, setDescTarea] = useState("Tarea por Defecto ");
  const [estadoTarea, setEstadoTarea] = useState("");
  const [fechaiTarea, setFechaITarea] = useState("2000-01-01");
  const [fechamTarea, setFechaMTarea] = useState("2000-01-01");
  const [idDesarrollador, setIdDesarrollador] = useState(0);
  const [rol, setRol] = useState("");
  const [tiempoInicio, setTiempoInicio] = useState("");
  const [tiempoFinal, setTiempoFinal] = useState("");
  const [desarrollador, setDesarrollador] = useState("");
  const [estadoPadre, setEstadoPadre] = useState(false);
  const [data2, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [entregaActiva, setEntregaActiva] = useState("");
  const [iteracionActiva, setIteracionActiva] = useState("");
  //const [objetivoIteracion, setObjetivoIteracion] = useState("");
  //const [idUsuario, setIdUsuario] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema)
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({
    resolver: zodResolver(collabSchema)
  });

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm({
    resolver: zodResolver(updateTaskSchema)
  });

  const { user } = useAuth();

  const onSubmit3 = handleSubmit3(async (values) => {
    setTareasKanban(prevData =>
      prevData.map(card =>
        card.ID === idTarea
          ? { ...card, NOMBRE: nombreTarea, DESCRIPCION: descTarea, ESTADO_DESARROLLO: estadoTarea, FECHA_INICIO: fechaiTarea, FECHA_MAX_TERMINO: fechamTarea, ROL: rol } : card
      )
    );
    const updatedTask = {
      ID: idTarea,
      NOMBRE: nombreTarea,
      DESCRIPCION: descTarea,
      ESTADO_DESARROLLO: estadoTarea,
      FECHA_INICIO: fechaiTarea,
      FECHA_MAX_TERMINO: fechamTarea,
      HORA_INICIO: tiempoInicio,
      HORA_TERMINO: tiempoFinal,
      ROLPARTICIPANTE: rol,
      iteracion: iteracionactual,
      IDDESARROLLADOR: selectedTarea.IDDESARROLLADOR
      //IDUSUARIO: idUsuario,
    }

    if (updateTask(updatedTask)) {
      console.log("Se actualizará la info local");
    } else {
      console.log("No se actualizará la info local");
    }
    //console.log(matchingTasks);
    //console.log(matchingIndex);
    console.log('Guardar cambios');
    setDialogVisible(false);
  });

  const onSubmit2 = handleSubmit2(async (values) => {
    console.log("valores");
    console.log(values);
    console.log(values.ID_USUARIOC);
    console.log(values.ROLPARTICIPANTEC);
    const data = {
      ID_USUARIO: values.ID_USUARIOC,
      ROLPARTICIPANTE: values.ROLPARTICIPANTEC,
      ID_TAREA_REALIZADA: selectedTarea.ID_TAREA_REALIZADA,
      ITERACION: iteracionactual.ID
    }
    const des = participants.find(part => part.ID_USUARIO == values.ID_USUARIOC);
    console.log(des);
    const dataLocal = {
      DESCRIPCION: selectedTarea.DESCRIPCION,
      Desarrollador: des.NOMBRE_USUARIO,
      ESTADO_DESARROLLO: selectedTarea.ESTADO_DESARROLLO,
      ESTADO_PADRE: selectedTarea.ESTA_PADRE,
      ESTADO_PERMITIDO_PADRE: selectedTarea.ESTADO_PERMITIDO_PADRE,
      FECHA_INICIO: selectedTarea.FECHA_INICIO,
      FECHA_MAX_TERMINO: selectedTarea.FECHA_MAX_TERMINO,
      FECHA_TERMINO: selectedTarea.FECHA_TERMINO,
      ID: selectedTarea.ID,
      IDK: `${selectedTarea.NOMBRE}-${values.ID_USUARIOC}`,
      IDDESARROLLADOR: values.ID_USUARIOC,
      ID_ITERACION: selectedTarea.ID_ITERACION,
      ID_REQUERIMIENTO: selectedTarea.ID_REQUERIMIENTO,
      ID_TAREA_PADRE: selectedTarea.ID_TAREA_PADRE,
      ID_TAREA_REALIZADA: selectedTarea.ID_TAREA_REALIZADA,
      NOMBRE: selectedTarea.NOMBRE,
      NOMBRE_TAREA_PADRE: selectedTarea.NOMBRE_TAREA_PADRE,
      OBJETIVO: selectedTarea.OBJETIVO,
      ROL: values.ROLPARTICIPANTEC,
      ROL_REALIZADO: ""
    }
    console.log(dataLocal);
    addCollab(data);
    setTareasKanban((prevdata) => [...prevdata, dataLocal]);
    const data1 = {
      ID: idint,
      USER : user.ID
  }
  getPermissions(data1);
  console.log(userRole);
    //setDialogVisible(true);
  });

  const onSubmit = handleSubmit(async (values) => {
    console.log("submit iniciado");
    const data = {
      NOMBRE: values.NOMBRE,
      DESCRIPCION: values.DESCRIPCION,
      FECHA_INICIO: values.FECHA_INICIO,
      FECHA_MAX_TERMINO: values.FECHA_MAX_TERMINO,
      HORAINICIO: values.HORAINICIO,
      HORAMAXIMA: values.HORAMAXIMA,
      ID_REQUERIMIENTO: values.ID_REQUERIMIENTO,
      ROLPARTICIPANTE: values.ROLPARTICIPANTE,
      ID_USUARIO: values.ID_USUARIO,
      ID_TAREA_DEPENDIENTE: values.ID_TAREA_DEPENDIENTE,
      iteracionactual: iteracionactual,
      CORREO: user.CORREO
    }
    /*console.log(values.ID_TAREA_DEPENDIENTE);*/
    const des = participants.find(part => part.ID_USUARIO == values.ID_USUARIO);
    let estadop = 0;
    if (values.ID_TAREA_DEPENDIENTE != 0) {
      const tp = tareasKanban.find(tarea => tarea.ID == values.ID_TAREA_DEPENDIENTE);
      if (tp.ESTADO_DESARROLLO != "Cerrada") {
        estadop = 0;
      } else {
        estadop = 1;
      }
      console.log(tp);
    } else {
      estadop = 1;
      console.log("No se ha seleccionado una tarea dependiente");
    }

    console.log(values.ID_TAREA_DEPENDIENTE);
    const dataLocal = {
      NOMBRE: values.NOMBRE,
      DESCRIPCION: values.DESCRIPCION,
      FECHA_INICIO: values.FECHA_INICIO,
      FECHA_MAX_TERMINO: values.FECHA_MAX_TERMINO,
      HORAINICIO: values.HORAINICIO,
      HORAMAXIMA: values.HORAMAXIMA,
      ID_REQUERIMIENTO: values.ID_REQUERIMIENTO,
      ROLPARTICIPANTE: values.ROLPARTICIPANTE,
      ID_USUARIO: values.ID_USUARIO,
      ID_TAREA_DEPENDIENTE: values.ID_TAREA_DEPENDIENTE,
      iteracionactual: iteracionactual,
      CORREO: user.CORREO,
      ESTADO_DESARROLLO: "En espera",
      ID_DESARROLLADOR: values.ID_USUARIO,
      Desarrollador: des.NOMBRE_USUARIO,
      ESTADO_PERMITIDO_PADRE: estadop,
      IDK: `${values.NOMBRE}-${values.ID_USUARIO}`
    }
    console.log(estadop);
    setTareasKanban((prevdata) => [...prevdata, dataLocal]);
    setDialogVisible(false);
    createTask(data);

    
        const data1 = {
            ID: idint,
            USER : user.ID
        }
        getPermissions(data1);
        console.log(userRole);
  });


  useEffect(() => {
    console.log(tareasKanban);
    console.log(iteracionactual);
    console.log(entregaactual);
    console.log(user);
    const date1 = new Date();
    const date2 = new Date(entregaactual.FECHA_TERMINO);
    const date3 = new Date(iteracionactual.FECHA_TERMINO);
    setDialogVisible(false);
    setSelectedTarea(null);
    setProjecterrors([]);
    setMessage([]);
    setData(tareasKanban);
    //setObjetivoIteracion(iteracionactual.OBJETIVO);
    if(objetivoItAct == "" && userRole){
      swal({
        title: "Agregar Objetivo de Iteración",
        text: "Aún no se ha registrado un objetivo para esta iteración, por favor agrégalo ahora.",
        content: {
          element: 'input',
          attributes: {
            placeholder: 'Inserta un objetivo',
            type: 'text'
          },
        },
        icon: 'info',
      }).then((objetivo) => {
        if(!objetivo) return;
          setObjItAct(objetivo);

          const data = {
            ID: iteracionactual.ID,
            OBJETIVO: objetivo
          }

          setObjetivo(data);
      });
    }

    const day1 = date1.getDate();
    const month1 = date1.getMonth(); // Los meses en JavaScript son 0-indexados (0 = Enero, 1 = Febrero, etc.)
    const year1 = date1.getFullYear();

    // Extraer día, mes y año de la segunda fecha
    const day2 = date2.getDate();
    const month2 = date2.getMonth();
    const year2 = date2.getFullYear();

    // Extraer día, mes y año de la segunda fecha
    const day3 = date3.getDate();
    const month3 = date3.getMonth();
    const year3 = date3.getFullYear();

    const filtrado = tareasKanban.filter(card => card.ESTADO_DESARROLLO !== "Cerrada");
    
    if(year1 == year3 && month1 == month3 && day1 == day3 && userRole && filtrado.length > 0){
      swal({
        title: "Iteración por Terminar",
        text: `La iteración actual está en su último día de desarrollo, y existen ${filtrado.length} tareas que aun no son terminadas, por favor dirijase a la configuracion del proyecto y actualice la fecha de termino de esta iteracion.`,
        icon:'waring',
        buttons: {
          cancel: "Cancelar",
          confirm: "Confirmar"
        }
      }).then((value) =>{
        if(value === "confirm"){

        }else if(value === "cancel"){

        }
      });
    }

    if(year1 == year2 && month1 == month2 && day1 == day2 && userRole){
      swal({
        title: "Retroalimentacioón de Entrega",
        text: "La entrega actual está por terminar, en caso de que ya se cuente con la retroalimentación necesaria por favor ingrésela, de lo contrario de click fuera de esta ventana",
        content: {
          element: 'input',
          attributes: {
            placeholder: 'Inserta la retroalimentacion',
            type: 'text'
          },
        },
        icon:'info',
      }).then((retro) =>{
        if(!retro) return;

        const data = {
          ID: entregaactual.ID,
          RETRO: retro,
        }
        setRetroalimentacion(data);
      });
    }

  
  }, []);

  useEffect(() => {
    if (entregas != null && iteraciones != null) {
      const found = entregas.find(entrega => entrega.ID === entregaactual.ID);
      const found2 = iteraciones.find(iteracion => iteracion.ID === iteracionactual.ID);
      setEntregaActiva(found.Nombre_Entrega);
      setIteracionActiva(found2.Nombre_Iteracion);
    }
  }, [entregas, iteraciones]);

  useEffect(() => {

    const data = {
      ID: idint
    }
    getPermissions(data);
    console.log(userRole);
  }, [userRole]);

  useEffect(() => {
    setDialogVisible(false);
    setSelectedTarea(null);
  }, [tareasKanban]);

  useEffect(() => {
    if (selectedTarea != null) {
      console.log(selectedTarea);
      setIDTarea(selectedTarea.ID);
      setIdK(selectedTarea.IDK);
      setNomTarea(selectedTarea.NOMBRE + " ");
      setDescTarea(selectedTarea.DESCRIPCION + " ");
      setEstadoTarea(selectedTarea.ESTADO_DESARROLLO);
      setIdDesarrollador(selectedTarea.IDDESARROLLADOR);
      console.log(selectedTarea.IDDESARROLLADOR);
      console.log(selectedTarea.Desarrollador);
      setDesarrollador(selectedTarea.Desarrollador);
      setRol(selectedTarea.ROL);
      console.log("ESTADO PADRE");
      console.log(selectedTarea.ESTADO_PERMITIDO_PADRE);
      setEstadoPadre(selectedTarea.ESTADO_PERMITIDO_PADRE);
      const fecha_inicio = new Date(selectedTarea.FECHA_INICIO);
      const fecha_mx = new Date(selectedTarea.FECHA_MAX_TERMINO);
      let di = fecha_inicio.getDate();
      let mi = fecha_inicio.getMonth() + 1;
      if (mi < 10) {
        mi = "0" + mi;
      }
      if (di < 10) {
        di = "0" + di;
      }
      const yi = fecha_inicio.getFullYear();
      const hi = fecha_inicio.getHours();
      const mini = fecha_inicio.getMinutes();
      let hoursi = (hi < 10 ? '0' + hi : hi);
      let minutesi = (mini < 10 ? '0' + mini : mini);
      let fecha = yi + "-" + mi + "-" + di;

      let df = fecha_mx.getDate();
      let mf = fecha_mx.getMonth() + 1;
      if (mf < 10) {
        mf = "0" + mf;
      }
      if (df < 10) {
        df = "0" + df;
      }
      const yf = fecha_mx.getFullYear();
      const hf = fecha_mx.getHours();
      const minf = fecha_mx.getMinutes();
      let hoursf = (hf < 10 ? '0' + hf : hf);
      let minutesf = (minf < 10 ? '0' + minf : minf);
      let fechaf = yf + "-" + mf + "-" + df;

      setFechaITarea(fecha);
      setTiempoInicio(`${hoursi}:${minutesi}`);
      setFechaMTarea(fechaf);
      setTiempoFinal(`${hoursf}:${minutesf}`);
      console.log(estadoTarea);
    }
  }, [selectedTarea]);

  const tooltipTemplate = (data) => (
    <div>
      <p><b>ID:</b> {data.ID}</p>
      <p><b>DESCRIPCION:</b> {data.DESCRIPCION}</p>
      <p><b>Requerimiento:</b> {data.OBJETIVO}</p>
      <p><b>Estado:</b> {data.ESTADO_DESARROLLO}</p>
      <p><b>Entregar antes de:</b> {data.FECHA_MAX_TERMINO}</p>
      <p><b>Desarrollador:</b> {data.Desarrollador}</p>
    </div>
  );

  const DialogOpen = (args) => {
    args.cancel = true;

  }

  const handleKeyDownN = (event) => {
    if (event.key === ' ') {
      // Ingresa un espacio cuando se presiona la tecla de espacio
      setNomTarea(nombreTarea + ' ');
      // Evita el comportamiento predeterminado de la tecla de espacio
      event.preventDefault();
    }
  }

  const handleKeyDownD = (event) => {
    if (event.key === ' ') {
      // Ingresa un espacio cuando se presiona la tecla de espacio
      setDescTarea(descTarea + ' ');
      // Evita el comportamiento predeterminado de la tecla de espacio
      event.preventDefault();
    }
  }

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setSelectedTarea(null);
  };

  const handleDoubleClick = (data) => {
    //console.log(data.ESTADO_PERMITIDO_PADRE);
    //if (data.ESTADO_PERMITIDO_PADRE == 1) {
      setDialogVisible(true);
      setSelectedTarea(data);
    //} else {
      //console.log(data);
      /*swal({
        title: 'Ha habido un error',
        text: 'Esta tarea esta bloqueada debido a que su tarea madre no ha sido terminada y no puede ser editada',
        icon: 'error',
        button: 'Aceptar',
      });*/
      //setDialogVisible(false);
      //setSelectedTarea(null);
      //alert('Esta tarjeta está bloqueada y no puede ser editada.');
    //}
    console.log("Selected Tarea");
    console.log(selectedTarea);
  }

  const onDragStop = (args) => {
    console.log(args.data);

    if (args.data[0].ESTADO_PERMITIDO_PADRE === 0) {
      args.cancel = true;
      alert('Esta tarjeta está bloqueada y no puede ser movida.');
      setDialogVisible(false);
      setSelectedTarea(null);
    } else {
      console.log(args.data);
      const dragTask = {
        ESTADO_DESARROLLO: args.data[0].ESTADO_DESARROLLO,
        ID: args.data[0].ID,
      };

      

      if (args.data[0].ESTADO_DESARROLLO === "Cerrada") {
        const tareashijas = tareasKanban.filter(tarea => tarea.ID_TAREA_PADRE === args.data[0].ID);
        console.log("Tareas Hijas");
        console.log(tareashijas);
        console.log(tareashijas.length);

        if (tareashijas.length > 0) {
          const updatedTasks = tareasKanban.map(card =>
            tareashijas.some(tarea => tarea.ID === card.ID)
              ? { ...card, ESTADO_PERMITIDO_PADRE: 1 }
              : card
          );

          setTareasKanban([...updatedTasks]); // Forzar la re-renderización
        }
      }

      updateTaskState(dragTask);
      const updatedEstatetask = tareasKanban.map(card => card.ID_TAREA_REALIZADA == args.data[0].ID_TAREA_REALIZADA ? 
                                                  {...card, ESTADO_DESARROLLO: args.data[0].ESTADO_DESARROLLO } : 
                                                  card
      );
      console.log(updatedEstatetask);
      setTareasKanban([...updatedEstatetask]);

      const data1 = {
        ID: idint,
        USER : user.ID
    }
    getPermissions(data1);
    console.log(userRole);
    }
  };

  const onDragStart = (args) => {
    console.log(args.data);
    if (args.data[0].ESTADO_PERMITIDO_PADRE == 0) {
      args.cancel = true;
      //alert('Esta tarjeta está bloqueada y no puede ser movida.');
      swal({
        title: 'Ha habido un error',
        text: 'Esta tarea esta bloqueada debido a que su tarea madre no ha sido terminada y no puede ser movida',
        icon: 'error',
        button: 'Aceptar',
      });
      setDialogVisible(false);
      setSelectedTarea(null);
    } else {
      console.log(args.data);
    }
  }


  const handleDelete = () => {
    const deletedTask = {
      ID: idTarea,
      //IDUSUARIO: IdUsuario
    }

    swal({
      title: 'Eliminar Tarea',
      text: '¿Estás seguro de eliminar esta tarea? Esta acción eliminará la tarea de forma definitiva para todos los colaboradores',
      icon: 'warning',
      buttons: ['Cancelar', 'Eliminar'],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        deleteTask(deletedTask);

        setTareasKanban(prevData =>
          prevData.filter(card => card.ID !== idTarea)
        );
        setDialogVisible(false);
      }
    });
  }

  const onBeforeOpen = (args) => {
    args.maxHeight = '800px';
  }

  const handleSave = async () => {
    // Lógica para guardar cambios
    //console.log(idTarea);
    /*setTareasKanban(prevData =>
      prevData.map(card =>
        card.ID === idTarea
          ? { ...card, NOMBRE: nombreTarea, DESCRIPCION: descTarea, ESTADO_DESARROLLO: estadoTarea, FECHA_INICIO: fechaiTarea, FECHA_MAX_TERMINO: fechamTarea, ROL: rol } : card
      )
    );*/
    const updatedTask = {
      ID: idTarea,
      NOMBRE: nombreTarea,
      DESCRIPCION: descTarea,
      ESTADO_DESARROLLO: estadoTarea,
      FECHA_INICIO: fechaiTarea,
      FECHA_MAX_TERMINO: fechamTarea,
      HORA_INICIO: tiempoInicio,
      HORA_TERMINO: tiempoFinal,
      ROLPARTICIPANTE: rol,
      iteracion: iteracionactual,
      IDDESARROLLADOR: selectedTarea.IDDESARROLLADOR
      //IDUSUARIO: idUsuario,
    }
    const resp = await updateTask(updatedTask);

    if (resp) {
      console.log("La info local sera actualizada");
      setTareasKanban(prevData =>
        prevData.map(card =>
          card.ID === idTarea
            ? { ...card, NOMBRE: nombreTarea, DESCRIPCION: descTarea, ESTADO_DESARROLLO: estadoTarea, FECHA_INICIO: fechaiTarea, FECHA_MAX_TERMINO: fechamTarea, ROL: rol } : card
        )
      );
      setDialogVisible(false);
    } else {
      console.log("La info local no sera actualizada");
    }
    //console.log(matchingTasks);
    //console.log(matchingIndex);
    console.log('Guardar cambios');
  };

  const handleCancel = () => {
    // Lógica para cancelar
    console.log('Cancelar');
    setDialogVisible(false);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    if (term === "") {
      console.log("busqueda vacia");
      setTareasKanban(data2);
    } else {
      console.log(search);
      setTareasKanban(prevdata =>
        prevdata.filter(item => item.NOMBRE.toLowerCase().startsWith(term.toLowerCase()))
      );
    }
  }

  const handleDeleteCollab = () => {
    console.log("Hola boton delete collab");
    const collab = {
      ID_TAREA: idTarea,
      ID_USUARIO: idDesarrollador
    }

    swal({
      title: 'Eliminar Colaborador',
      text: '¿Estás seguro de eliminar a este usuario como colaborador de la tarea?',
      icon: 'warning',
      buttons: ['Cancelar', 'Eliminar'],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        deleteCollab(collab);
        setTareasKanban(prevdata => prevdata.filter(card => card.IDK !== idK));
        setDialogVisible(false);
        setSelectedTarea(null);
        //swal("Colaborador eliminado","El usuario ya no participará en esta tarea", "success");
      }
    });
  }



  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl e-kanbantooltiptemp">
      <Header category="App" title="Kanban" />
      <div className="w-full ">
      <h2 className="text-lg border-b-4 mb-4"><strong className='text-xl mr-2'>Periodo Activo: </strong> {iteracionActiva ? iteracionActiva : "Cargando iteracion Activa"} {" de "} {entregaActiva ? entregaActiva : "Cargando entrega activa"}   : {iteracionactual.FECHA_INICIO ? new Date(iteracionactual.FECHA_INICIO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"} - {iteracionactual.FECHA_TERMINO ? new Date(iteracionactual.FECHA_TERMINO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"} </h2>
      </div>
      <div className="w-full">
      <h2 className="text-lg border-b-4 mb-4"><strong className='text-xl mr-2'>Objetivo: </strong> {objetivoItAct != "" ? objetivoItAct : "Cargando Objetivo de Iteracion"} </h2>
      </div>
      <div className='m-3 w-full flex'>
        <div className='w-6/12'>
          <input
            type="text"
            name="search"
            placeholder='Buscar Tarea'
            className="block w-full px-4 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
            onChange={handleSearch}
          />
        </div>
        <div className='w-6/12 flex justify-end mr-7'><button className='p-1 w-fit rounded-xl border-1 border-blue-700 flex justify-center ' data-bs-toggle="modal" data-bs-target="#exampleModal"><FontAwesomeIcon icon={faCirclePlus} className='fa-flip' style={{ color: currentColor, fontSize: '1.5rem' }} /><p className='ml-1'>Agregar Tarea</p></button></div>
      </div>
      <KanbanComponent
        id="kanban"
        keyField='ESTADO_DESARROLLO'
        dataSource={tareasKanban}
        cardSettings={{ contentField: "NOMBRE", headerField: "IDK" }}
        enableTooltip={true}
        swimlaneSettings={{ keyField: "Desarrollador", enableFrozenRows: true }}
        locale='esp'
        dialogOpen={DialogOpen.bind(this)}
        tooltipTemplate={tooltipTemplate.bind(this)}
        //dialogSettings={{template:dialogTemplate }}
        cardDoubleClick={(args) => { handleDoubleClick(args.data) }}
        dragStart={onDragStart}
        dragStop={onDragStop}
      >
        <ColumnsDirective >
          <ColumnDirective headerText="Por Hacer" keyField="En espera, Bloqueada" allowToggle={true} />
          <ColumnDirective headerText="Pausadas" keyField="En pausa" allowToggle={true} />
          <ColumnDirective headerText="En desarrollo" keyField="En desarrollo" allowToggle={true} cssClass='in-progress-column' />
          <ColumnDirective headerText="Atrasada" keyField="Atrasada" allowToggle={true} cssClass='testing-column' />
          <ColumnDirective headerText="Por Revisar" keyField="Por Revisar" allowToggle={true} cssClass='testing-column' />
          <ColumnDirective headerText="Cerrada" keyField="Cerrada" cssClass='done-column' />
        </ColumnsDirective>

        <StackedHeadersDirective>
          <StackedHeaderDirective text='Fase Inicial' keyFields='En espera, Bloqueada, En pausa'></StackedHeaderDirective>
          <StackedHeaderDirective text='Fase de Desarrollo' keyFields='En desarrollo, Atrasada'></StackedHeaderDirective>
          <StackedHeaderDirective text='Fase Final' keyFields='Por Revisar, Cerrada'></StackedHeaderDirective>
        </StackedHeadersDirective>
      </KanbanComponent>
      <DialogComponent
        id="kanban_dialog"
        header='Detalles de Tarea'
        width='800px'
        height='700px'
        target='#kanban'
        showCloseIcon={true}
        close={handleCloseDialog}
        closeOnEscape={true}
        visible={dialogVisible}
        beforeOpen={onBeforeOpen}
        zIndex={2000}
      >
        <form className='h-full' onSubmit={handleSubmit3(onSubmit3)}>
          <input type="text" id="ID" name="ID" className='hidden' defaultValue={idTarea} />
          <div className="input-group mb-3 flex items-center ">
            <label htmlFor="tarea" className='block text-sm font-semibold text-gray-800'>Tarea: </label>
            <input className="w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder=
              "task" aria-label="Username" id="NOMBREU" name='NOMBREU' value={nombreTarea} spellCheck={false}
              onChange={(e) => setNomTarea(e.target.value)} onKeyDown={handleKeyDownN} />
          </div>
          <div className="input-group mb-3 flex items-center ">
            <label htmlFor="desc-tarea" className='block text-sm font-semibold text-gray-800'>Descripcion: </label>
            <textarea type="text" spellCheck={false} className="w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder=
              "task-desc" rows={4} aria-label="Username" id="DESCRIPCIONU" name='DESCRIPCIONU'
              value={descTarea} onChange={(e) => setDescTarea(e.target.value)} onKeyDown={handleKeyDownD}></textarea>
          </div>
          <div className="input-group mb-3 flex items-center ">
            <label htmlFor="estado" className='block text-sm font-semibold text-gray-800'>Estado: </label>
            <select id="ESTADOU"  disabled={estadoPadre == 0 ? true : false} value={estadoTarea} name='ESTADOU' onChange={(e) => setEstadoTarea(e.target.value)} className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40">
              <option value="0" >Selecciona una opción</option>
              <option value="En espera" >En espera</option>
              <option value="En pausa" >Pausada</option>
              <option value="En desarrollo" >En desarrollo</option>
              <option value="Atrasada" >Atrasada</option>
              <option value="Por Revisar" >Por Revisar</option>
              <option value="Cerrada" >Cerrada</option>
            </select>
          </div>
          <div className="input-group mb-3 flex items-center ">
            <div className=' flex items-center w-full'>
              <div className='w-6/12 px-4'>
                <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                  Fecha de inicio
                </label>
              </div>
              <div className='w-6/12 px-4'>
                <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                  Hora de inicio
                </label>
              </div>
            </div>
            <div className="flex items-center w-6/12 px-4" >
              <input
                type="date"
                id="FECHA_INICIOU"
                name="FECHA_INICIOU"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={fechaiTarea}
                onChange={(e) => setFechaITarea(e.target.value)}
              />
            </div>
            <div className='flex items-center w-6/12 px-4'>
              <input
                type="time"
                id="HORAINICIOU"
                name="HORAINICIOU"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={tiempoInicio}
                onChange={(e) => setTiempoInicio(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group mb-3 flex items-center ">
            <div className="flex w-full items-center">
              <div className='w-6/12 px-4'>
                <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                  Fecha Máxima de término
                </label>
              </div>
              <div className='w-6/12 px-4'>
                <label htmlFor="FECHA_TERMINO" className="block text-sm font-semibold text-gray-800">
                  Hora Máxima de término
                </label></div>
            </div>
            <div className='w-6/12 px-4 flex items-center'>
              <input
                type="date"
                id="FECHA_MAX_TERMINOU"
                name="FECHA_MAX_TERMINOU"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={fechamTarea}
                onChange={(e) => setTiempoFinal(e.target.value)}
              />
            </div>
            <div className='w-6/12 px-4 flex items-center'>
              <input
                type="time"
                id="HORAMAXIMAU"
                name="HORAMAXIMAU"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={tiempoFinal}
                onChange={(e) => setFechaMTarea(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group mb-3 flex items-center ">
            <label htmlFor="ID_USUARIO" className="block text-sm font-semibold text-gray-800">
              Participante Asignado <span className=' text-sm font-semibold text-red-800'>*</span><span data-toggle="tooltip" title="Agregar Colaborador"><button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2"><FontAwesomeIcon icon={faUserPlus} className="fa-icon mx-4" style={{ cursor: 'pointer', color: currentColor, fontSize: '1rem' }} /></button></span>
            </label>
            <div className='flex block w-full px-4 py-2 mt-2 justify-center items-center'>
              <div className='w-2/12 flex justify-center'><p className='font-semibold'>{desarrollador}</p></div>
              <div className='w-8/12'><select id="ROLPARTICIPANTEU" name="ROLPARTICIPANTEU" value={rol} onChange={(e) => setRol(e.target.value)} className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"><option value="0">Selecciona un rol</option>
                <option value="DISEÑADOR PRINCIPAL">Diseñador Principal</option>
                <option value="DISEÑADOR">Diseñador</option>
                <option value="EMBAJADOR">Embajador</option></select></div>
              <div className='w-2/12 flex justify-center'><span data-toggle="tooltip" title="Eliminar Colaborador"><button type="button" onClick={handleDeleteCollab}><FontAwesomeIcon icon={faUserMinus} className="fa-icon mx-4" style={{ cursor: 'pointer', color: currentColor, fontSize: '1rem' }} /></button></span></div>
            </div>
          </div>
          <div className="e-footer-content">
            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-delete" onClick={handleDelete}>Eliminar</button>
            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-edit e-primary" onClick={handleSave}>Guardar</button>
            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-cancel" onClick={handleCloseDialog}>Cancelar</button>
          </div>
        </form>
      </DialogComponent>
      {/* Modal Dialog*/}
      <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" style={{ zIndex: 2000 }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div>
              <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
                <div className='w-full d-flex justify-between items-center'>
                  <h2 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase">
                    Agrega un Colaborador
                  </h2>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form className="mt-6" onSubmit={handleSubmit2(onSubmit2)}>
                  {/* Participante Asignado */}
                  <div className="mb-2">
                    <label htmlFor="ID_USUARIO" className="block text-sm font-semibold text-gray-800">
                      Participante a Asignar <span className=' text-sm font-semibold text-red-800'>*</span>
                    </label>
                    <select
                      id="ID_USUARIOC"
                      name="ID_USUARIOC"
                      className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      {...register2("ID_USUARIOC", { required: true, message: "campo requerido" })}
                    >
                      <option value="0">Asigna un participante</option>
                      {participants.map((participant) => (
                        <option key={participant.ID_USUARIO} value={participant.ID_USUARIO}>
                          {participant.NOMBRE_USUARIO}
                        </option>
                      ))}

                    </select>
                    {errors2.ID_USUARIOC &&
                      <div className="p-2">
                        <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors2.ID_USUARIOC.message}</div>
                      </div>
                    }
                  </div>
                  {/* Rol del Participante */}
                  <div className="mb-2">
                    <label htmlFor="ROLPARTICIPANTEC" className="block text-sm font-semibold text-gray-800">
                      Rol del Participante <span className=' text-sm font-semibold text-red-800'>*</span>
                    </label>
                    <select
                      id="ROLPARTICIPANTEC"
                      name="ROLPARTICIPANTEC"
                      className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      {...register2("ROLPARTICIPANTEC", { required: true, message: "campo requerido" })}
                    >
                      <option value="0">Selecciona un rol</option>
                      <option value="Diseñador Principal">Diseñador Principal</option>
                      <option value="Diseñador">Diseñador</option>
                      <option value="Embajador">Embajador</option>
                    </select>
                    {errors2.ROLPARTICIPANTEC &&
                      <div className="p-2">
                        <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors2.ROLPARTICIPANTEC.message}</div>
                      </div>
                    }
                  </div>
                  <div className="mt-6">
                    <button type='submit'
                      className="w-full px-4 py-2 tracking-wide 
                    text-white transition-colors duration-200 
                    transform bg-indigo-700 rounded-md hover:bg-indigo-600 
                    focus:outline-none focus:bg-indigo-600"
                      data-bs-target="#exampleModal2"
                    >
                      Agregar Colaborador
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Dialog*/}
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {fechasproject[0].ESTADO === "En espera" &&
              <div>
                {iteracionactual === "" &&
                  <div className="w-full p-6 m-auto bg-white rounded-md  ring-indigo-600 lg:max-w-xl">
                    No puedes asignar tareas aun
                  </div>}
              </div>}

            {fechasproject[0].ESTADO === "En desarrollo" &&
              <div>
                {/*message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
            <p class="text-lg font-semibold m-2">{message}</p>
          </div>
          }
          {projecterrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
            <p class="text-lg font-semibold m-2">{projecterrors}</p>
          </div>*/
                }
                {iteracionactual !== "" &&

                  <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
                    <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase">
                      Asigna una tarea
                    </h1>
                    <form className="mt-6" onSubmit={handleSubmit(onSubmit)} >
                      {/* Nombre de la tarea */}
                      <div className="mb-2">
                        <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                          Nombre de la tarea <span className='text-sm font-semibold text-red-800'>*</span>
                        </label>
                        <input
                          type="text"
                          name="NOMBRE"
                          placeholder='Nombre de la tarea'
                          className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          {...register("NOMBRE", { required: true, message: "campo requerido" })}
                        />
                        {errors.NOMBRE &&
                          <div className="p-2">
                            <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.NOMBRE.message}</div>
                          </div>
                        }
                      </div>

                      <div className="mb-2">
                        <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-800">
                          Descripción <span className='text-sm font-semibold text-red-800'>*</span>
                        </label>
                        <textarea
                          name="DESCRIPCION"
                          placeholder='Descripción de la tarea'
                          className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          rows="4"
                          {...register("DESCRIPCION", { required: true, message: "campo requerido" })}
                        ></textarea>
                        {errors.DESCRIPCION &&
                          <div className="p-2">
                            <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.DESCRIPCION.message}</div>
                          </div>
                        }
                      </div>

                      <div className="mb-2">
                        <div className="flex flex-col md:flex-row justify-around items-center">
                          <div>
                            <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                              Fecha de inicio <span className='text-sm font-semibold text-red-800'>*</span>
                            </label>
                            <input
                              type="date"
                              id="FECHA_INICIO"
                              name="FECHA_INICIO"
                              className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                              {...register("FECHA_INICIO", { required: true, message: "campo requerido" })}
                            />
                            {errors.FECHA_INICIO &&
                              <div className="p-2">
                                <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.FECHA_INICIO.message}</div>
                              </div>
                            }
                          </div>

                          <div>
                            <label htmlFor="FECHA_MAX_TERMINO" className="block text-sm font-semibold text-gray-800">
                              Fecha de entrega <span className=' text-sm font-semibold text-red-800'>*</span>
                            </label>
                            <input
                              type="date"
                              id="FECHA_MAX_TERMINO"
                              name="FECHA_MAX_TERMINO"
                              className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                              {...register("FECHA_MAX_TERMINO", { required: true, message: "campo requerido" })}
                            />
                            {errors.FECHA_MAX_TERMINO &&
                              <div className="p-2">
                                <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.FECHA_MAX_TERMINO.message}</div>
                              </div>
                            }
                          </div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex flex-col md:flex-row justify-around items-center gap-4">
                          <div>

                            <label htmlFor="HORAINICIO" className="block text-sm font-semibold text-gray-800">
                              Hora de inicio <span className='text-sm font-semibold text-red-800'>*</span>
                            </label>
                            <input
                              type="time"
                              id="HORAINICIO"
                              name="HORAINICIO"
                              className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                              {...register("HORAINICIO", { required: true, message: "campo requerido" })}

                            />
                            {errors.HORAINICIO &&
                              <div className="p-2">
                                <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.HORAINICIO.message}</div>
                              </div>
                            }
                          </div>

                          <div>

                            <label htmlFor="HORAMAXIMA" className="block text-sm font-semibold text-gray-800">
                              Hora máxima de Entrega <span className='text-sm font-semibold text-red-800'>*</span>
                            </label>
                            <input
                              type="time"
                              id="HORAMAXIMA"
                              name="HORAMAXIMA"
                              className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                              {...register("HORAMAXIMA", { required: true, message: "campo requerido" })}
                            />
                            {errors.HORAMAXIMA &&
                              <div className="p-2">
                                <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.HORAMAXIMA.message}</div>
                              </div>
                            }
                          </div>

                        </div>
                      </div>

                      <div className="mb-2">
                        <label htmlFor="ID_REQUERIMIENTO" className="block text-sm font-semibold text-gray-800">
                          Requerimiento Cumplido <span className='text-sm font-semibold text-red-800'>*</span>
                        </label>
                        <select
                          id="ID_REQUERIMIENTO"
                          name="ID_REQUERIMIENTO"
                          className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          {...register("ID_REQUERIMIENTO", { required: true, message: "campo requerido" })}
                        >
                          <option value="0">Selecciona requerimiento</option>
                          {requerimientos.map((requerimiento) => (
                            <option key={requerimiento.ID} value={requerimiento.ID}>
                              {requerimiento.OBJETIVO}
                            </option>
                          ))}
                        </select>
                        {errors.ID_REQUERIMIENTO &&
                          <div className="p-2">
                            <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.ID_REQUERIMIENTO.message}</div>
                          </div>
                        }
                      </div>

                      {/* Tarea Dependiente */}
                      <div className="mb-2">
                        <label htmlFor="ID_TAREA_DEPENDIENTE " className="block text-sm font-semibold text-gray-800">
                          ¿Está tarea depende de otra? (Seleccione la tarea)
                        </label>
                        <select
                          id="ID_TAREA_DEPENDIENTE "
                          name="ID_TAREA_DEPENDIENTE "
                          className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          {...register("ID_TAREA_DEPENDIENTE", { required: true, message: "campo requerido" })}
                        >
                          <option value="0">Selecciona una tarea dependiente</option>
                          {tareas.map((tarea) => (
                            <option value={tarea.ID}>{tarea.NOMBRE}</option>
                          ))}
                        </select>

                      </div>

                      {/* Rol del Participante */}
                      <div className="mb-2">
                        <label htmlFor="ROLPARTICIPANTE" className="block text-sm font-semibold text-gray-800">
                          Rol del Participante <span className=' text-sm font-semibold text-red-800'>*</span>
                        </label>
                        <select
                          id="ROLPARTICIPANTE"
                          name="ROLPARTICIPANTE"
                          className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          {...register("ROLPARTICIPANTE", { required: true, message: "campo requerido" })}
                        >
                          <option value="0">Selecciona un rol</option>
                          <option value="Diseñador Principal">Diseñador Principal</option>
                          <option value="Diseñador">Diseñador</option>
                          <option value="Embajador">Embajador</option>
                        </select>
                        {errors.ROLPARTICIPANTE &&
                          <div className="p-2">
                            <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.ROLPARTICIPANTE.message}</div>
                          </div>
                        }
                      </div>

                      {/* Participante Asignado */}
                      <div className="mb-2">
                        <label htmlFor="ID_USUARIO" className="block text-sm font-semibold text-gray-800">
                          Participante Asignado <span className=' text-sm font-semibold text-red-800'>*</span>
                        </label>
                        <select
                          id="ID_USUARIO"
                          name="ID_USUARIO"
                          className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          {...register("ID_USUARIO", { required: true, message: "campo requerido" })}
                        >
                          <option value="0">Asigna un participante</option>
                          {participants.map((participant) => (
                            <option key={participant.ID_USUARIO} value={participant.ID_USUARIO}>
                              {participant.NOMBRE_USUARIO}
                            </option>
                          ))}

                        </select>
                        {errors.ID_USUARIO &&
                          <div className="p-2">
                            <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.ID_USUARIO.message}</div>
                          </div>
                        }
                      </div>

                      <div className="mt-6">
                        <button type='submit'
                          className="w-full px-4 py-2 tracking-wide 
                    text-white transition-colors duration-200 
                    transform bg-indigo-700 rounded-md hover:bg-indigo-600 
                    focus:outline-none focus:bg-indigo-600"
                          data-bs-toggle="modal" data-bs-target="#exampleModal"
                        >
                          Crear tarea
                        </button>
                      </div>

                    </form>
                  </div>
                }
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kanban;