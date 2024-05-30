import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import '@syncfusion/ej2-base/styles/material.css';
import { L10n } from '@syncfusion/ej2-base';
import { useProject } from '../context/projectContext';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

import '../css/kanban.module.css';

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
      'required': 'El campo es requerido'
    }
  }
});

const Kanban = () => {
  const { tareasKanban, setTareasKanban, deleteTask, updateTask, updateTaskState } = useProject();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [idTarea, setIDTarea] = useState(0);
  const [nombreTarea, setNomTarea] = useState("Tarea Defecto ");
  const [descTarea, setDescTarea] = useState("Tarea por Defecto ");
  const [estadoTarea, setEstadoTarea] = useState("");
  const [fechaiTarea, setFechaITarea] = useState("2000-01-01");
  const [fechamTarea, setFechaMTarea] = useState("2000-01-01");

  useEffect(() => {
    console.log(tareasKanban);
  }, []);

  useEffect(() => {

  }, [tareasKanban]);

  useEffect(() => {
    if (selectedTarea != null) {
      console.log(selectedTarea);
      setIDTarea(selectedTarea.ID);
      setNomTarea(selectedTarea.NOMBRE + " ");
      setDescTarea(selectedTarea.DESCRIPCION + " ");
      setEstadoTarea(selectedTarea.ESTADO_DESARROLLO);

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
      let fechaf = yf + "-" + mf + "-" + df;

      setFechaITarea(fecha);
      setFechaMTarea(fechaf);
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
    setDialogVisible(true);
    setSelectedTarea(data);
  }

  const onDragStop = (args) => {
    console.log(args.data);
    
    const dragTask = {
      ESTADO_DESARROLLO: args.data[0].ESTADO_DESARROLLO,
      ID: args.data[0].ID,
    }

    updateTaskState(dragTask);
  }

  const onDragStart = (args) => {
    console.log(args.data);
  }


  const handleDelete = () => {
    const deletedTask = {
      ID: idTarea
    }

    deleteTask(deletedTask);

    setTareasKanban(prevData =>
      prevData.filter(card => card.ID !== idTarea)
    );
    setDialogVisible(false);

  }

  const onBeforeOpen = (args) => {
    args.maxHeight = '800px';
  }

  const handleSave = () => {
    // Lógica para guardar cambios
    //console.log(idTarea);
    setTareasKanban(prevData =>
      prevData.map(card =>
        card.ID === idTarea
          ? { ...card, NOMBRE: nombreTarea, DESCRIPCION: descTarea, ESTADO_DESARROLLO: estadoTarea, FECHA_INICIO: fechaiTarea, FECHA_MAX_TERMINO: fechamTarea } : card
      )
    );
    const updatedTask = {
      ID: idTarea,
      NOMBRE: nombreTarea,
      DESCRIPCION: descTarea,
      ESTADO_DESARROLLO: estadoTarea,
      FECHA_INICIO: fechaiTarea,
      FECHA_MAX_TERMINO: fechamTarea
    }

    updateTask(updatedTask);
    //console.log(matchingTasks);
    //console.log(matchingIndex);
    console.log('Guardar cambios');
    setDialogVisible(false);
  };

  const handleCancel = () => {
    // Lógica para cancelar
    console.log('Cancelar');
    setDialogVisible(false);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl e-kanbantooltiptemp">
      <Header category="App" title="Kanban" />
      <KanbanComponent
        id="kanban"
        keyField='ESTADO_DESARROLLO'
        dataSource={tareasKanban}
        cardSettings={{ contentField: "DESCRIPCION", headerField: "NOMBRE" }}
        enableTooltip={true}
        swimlaneSettings={{ keyField: "Desarrollador" }}
        locale='esp'
        dialogOpen={DialogOpen.bind(this)}
        tooltipTemplate={tooltipTemplate.bind(this)}
        //dialogSettings={{template:dialogTemplate }}
        cardDoubleClick={(args) => { handleDoubleClick(args.data) }}
        dragStart={onDragStart}
        dragStop={onDragStop}
      >
        <ColumnsDirective>
          <ColumnDirective headerText="Pendiente" keyField="En espera" allowToggle={true} cssClass="e-column-key-Open" />
          <ColumnDirective headerText="En desarrollo" keyField="En desarrollo" allowToggle={true} cssClass='in-progress-column' />
          <ColumnDirective headerText="Por Revisar" keyField="Por Revisar" allowToggle={true} cssClass='testing-column' />
          <ColumnDirective headerText="Cerrada" keyField="Cerrada" cssClass='done-column' />
        </ColumnsDirective>
      </KanbanComponent>
      <DialogComponent
        id="kanban_dialog"
        header='Detalles de Tarea'
        width='800px'
        height='500px'
        target='#kanban'
        showCloseIcon={true}
        close={handleCloseDialog}
        closeOnEscape={true}
        visible={dialogVisible}
        beforeOpen={onBeforeOpen}
      >
        <form>
          <input type="text" id="ID" name="ID" className='hidden' defaultValue={idTarea} />
          <div className="input-group mb-3 flex items-center ">
            <label htmlFor="tarea" className='block text-sm font-semibold text-gray-800'>Tarea: </label>
            <input className="w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder=
              "task" aria-label="Username" id="tarea" name='tarea' value={nombreTarea} spellCheck={false}
              onChange={(e) => setNomTarea(e.target.value)} onKeyDown={handleKeyDownN} />
          </div>
          <div className="input-group mb-3 flex items-center ">
            <label htmlFor="desc-tarea" className='block text-sm font-semibold text-gray-800'>Descripcion: </label>
            <textarea type="text" spellCheck={false} className="w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder=
              "task-desc" rows={4} aria-label="Username" id="desc-tarea" name='desc-tarea'
              value={descTarea} onChange={(e) => setDescTarea(e.target.value)} onKeyDown={handleKeyDownD}></textarea>
          </div>
          <div className="input-group mb-3 flex items-center ">
            <label htmlFor="estado" className='block text-sm font-semibold text-gray-800'>Estado: </label>
            <select id="estado" value={estadoTarea} name='estado' onChange={(e) => setEstadoTarea(e.target.value)} className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40">
              <option value="" >Selecciona una opción</option>
              <option value="En espera" >En espera</option>
              <option value="En desarrollo" >En desarrollo</option>
              <option value="Por Revisar" >Por Revisar</option>
              <option value="Cerrada" >Cerrada</option>
            </select>
          </div>
          <div>
            <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
              Fecha de inicio
            </label>
            <input
              type="date"
              id="FECHA_INICIO"
              name="FECHA_INICIO"
              className="block w-full px-4 py-2 mt-6 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={fechaiTarea}
              onChange={(e) => setFechaITarea(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
              Fecha Máxima de término
            </label>
            <input
              type="date"
              id="FECHA_TERMINO"
              name="FECHA_TERMINO"
              className="block w-full px-4 py-2 mt-6 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={fechamTarea}
              onChange={(e) => setFechaMTarea(e.target.value)}
            />
          </div>
          <div className="e-footer-content">
            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-delete" onClick={handleDelete}>Eliminar</button>
            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-edit e-primary" onClick={handleSave}>Guardar</button>
            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-cancel" onClick={handleCloseDialog}>Cancelar</button>
          </div>
        </form>
      </DialogComponent>
    </div>
  );
};

export default Kanban;