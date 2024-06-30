import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requerimientoSchema } from '../schemas/project.js';
import { useProject } from "../context/projectContext.js";
import { useStateContext } from '../context/Provider.js';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Header } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import {
    GridComponent, ColumnsDirective, ColumnDirective, Inject, Page, Search, Toolbar, Edit, DialogEditEventArgs
} from '@syncfusion/ej2-react-grids';
import { L10n } from '@syncfusion/ej2-base';
import styles from '../css/voicereq.module.css';
import swal from 'sweetalert';
import { set } from 'zod';

L10n.load({
    'esp': {
        grid: {
            EmptyRecord: "Sin requerimientos para mostrar",
            GroupDropArea: 'Arrastra un encabezado de columna aqui para agrupar',
            UnGroup: 'Haz click aqui para desagrupar'
        },
        pager: {
            currentPageInfo: '{0} de {1} páginas',
            totalItemsInfo: '({0} elementos)',
            firstPageTooltip: 'Ir a la primera página',
            lastPageTooltip: 'Ir a la última página',
            nextPageTooltip: 'Ir a la página siguiente',
            previousPageTooltip: 'Ir a la página anterior',
            nextPagerTooltip: 'Ir al siguiente paginador',
            previousPagerTooltip: 'Ir al paginador anterior',
        },
        toolbar: {
            Add: 'Añadir',
            Edit: 'Editar',
            Delete: 'Eliminar',
            Update: 'Actualizar',
            Cancel: 'Cancelar',
            Search: 'Buscar',
            searchTooltip: 'Buscar'
        },
        searchbar: {
            Search: 'Buscar'
        }
    }
});

const Requerimientos = () => {

    const requirementsGrid = [
        { field: "ID", headerText: "ID", width: "100", textAlign: "center", headerTextAlign: "center", visible: false },
        { field: "OBJETIVO", headerText: "Objetivo", width: "200", textAlign: "left", headerTextAlign: "center" },
        { field: "DESCRIPCION", headerText: "Descripcion", width: "200", textAlign: "left", headerTextAlign: "center" },
        { field: "NOMBRE", headerText: "Tipo Requerimiento", width: "100", textAlign: "center", headerTextAlign: "center" },
        {
            field: 'Editar',
            headerText: 'Editar',
            width: '80',
            textAlign: 'Center',
            template: (props) => (
                <span data-toggle="tooltip" title="Editar"><FontAwesomeIcon icon={faPenToSquare} className="fa-icon" style={{ cursor: 'pointer', color: '#21e642', fontSize: '1.25rem' }} onClick={() => handlePenClick(props)} data-bs-toggle="modal" data-bs-target="#exampleModal"/></span>
            )
        },
        {
            field: 'Eliminar',
            headerText: 'Eliminar',
            width: '80',
            textAlign: 'Center',
            template: (props) => (
                <span data-toggle="tooltip" title="Eliminar"><FontAwesomeIcon icon={faTrash} className="fa-icon" style={{ cursor: 'pointer', color: '#f70808', fontSize: '1.25rem' }} onClick={() => handleTrashClick(props)}/></span>
            )
          },
    ];

    const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();
    const { createRequirements, entregaactual, fechasproject, projecterrors, message, requirements, getProject, setRequirements, deleteRequire, updateRequire } = useProject();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [reqLocal, setReqLocal] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm({
        resolver: zodResolver(requerimientoSchema)
    });

    useEffect(() => {
        setReqLocal(requirements);
    }, [requirements]);

    useEffect(() => {
        if (selectedReq) {
            const typereq = selectedReq.NOMBRE;
            setValue("OBJETIVO", selectedReq.OBJETIVO);
            setValue("DESCRIPCION", selectedReq.DESCRIPCION);
            setValue("TIPO", getTypeValue(typereq));
        } else {
            reset({
                OBJETIVO: "",
                DESCRIPCION: "",
                TIPO: "0"
            });
        }
    }, [selectedReq, setValue, reset]);

    const getTypeValue = (typereq) => {
        switch (typereq) {
            case "FUNCIONAL":
                return "1";
            case "NO FUNCIONAL":
                return "2";
            case "RENDIMIENTO":
                return "3";
            case "SEGURIDAD":
                return "4";
            case "CALIDAD":
                return "5";
            case "CAMBIO":
                return "6";
            default:
                return "0";
        }
    };

    const onSubmit = handleSubmit(async (values) => {
        const data = {
            OBJETIVO: values.OBJETIVO,
            DESCRIPCION: values.DESCRIPCION,
            TIPO: values.TIPO,
            ID_ENTREGA: entregaactual.ID
        };
        const tr = getTypeName(values.TIPO);

        const dataLocal = {
            ENTREGA: entregaactual.ID,
            OBJETIVO: values.OBJETIVO,
            DESCRIPCION: values.DESCRIPCION,
            NOMBRE: tr,
        }

        setReqLocal((prevdata) => [...prevdata, dataLocal]);
        createRequirements(data);
    });

    const getTypeName = (type) => {
        switch (type) {
            case "1":
                return "FUNCIONAL";
            case "2":
                return "NO FUNCIONAL";
            case "3":
                return "RENDIMIENTO";
            case "4":
                return "SEGURIDAD";
            case "5":
                return "CALIDAD";
            case "6":
                return "CAMBIO";
            default:
                return "";
        }
    };

    const handlePenClick = (props) => {
        setSelectedReq(props);
    };

    const handleTrashClick = (props) => {
        setSelectedReq(props);
        console.log(selectedReq);
        swal({
            title: 'Eliminar Requerimiento',
            text: '¿Estás seguro de eliminar este requerimiento? Esta acción eliminará el requerimiento de forma definitiva',
            icon: 'warning',
            buttons: ['Cancelar', 'Eliminar'],
            dangerMode: true,
          }).then((value) => {
            if (value) {
              //deleteTask(deletedTask);
              const require = {
                ID_REQUERIMIENTO: props.ID
              }
              const estado = deleteRequire(require);
              //setDialogVisible(false);
              if(estado){
                setReqLocal(prevData =>
                    prevData.filter(req => req.ID !== props.ID)
                  );
              }
            }
          });
        //alert(`Eliminar elemento en la fila con ID: ${props.ID}`);
    };

    const handleSaveEdit = () => {
        const editedValues = {
            ID_REQUERIMIENTO: selectedReq.ID,
            OBJETIVO: watch("OBJETIVO"),
            DESCRIPCION: watch("DESCRIPCION"),
            TIPO: watch("TIPO")
        };

        
        console.log("Valores editados:", editedValues);
        setReqLocal(prevData => 
            prevData.map(req =>
                req.ID === selectedReq.ID ?
                {...req, OBJETIVO: editedValues.OBJETIVO, DESCRIPCION: editedValues.DESCRIPCION, NOMBRE: getTypeName(editedValues.TIPO)} : req
            )
        );
        updateRequire(editedValues);
        //setIsEditDialogOpen(false);
    };

    return (
        <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category="App" title="REQUERIMIENTOS" />
            <div className='m-3 w-full flex'>
                <div className='w-6/12'></div>
                <div className='w-6/12 flex justify-end mr-7'>
                    <button className='p-1 w-fit rounded-xl border-1 border-blue-700 flex justify-center ' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setSelectedReq(null) }}>
                        <FontAwesomeIcon icon={faCirclePlus} className='fa-flip' style={{ color: currentColor, fontSize: '1.5rem' }} />
                        <p className='ml-1'>Agregar Requerimiento</p>
                    </button>
                </div>
            </div>
            <div className="card rounded-lg shadow-sm bg-white h-screen" id='conte'>
                <GridComponent
                    id='reqs'
                    dataSource={reqLocal}
                    allowPaging={true}
                    allowSorting={true}
                    allowDeleting={true}
                    toolbar={['Search', 'Edit']}
                    searchSettings={{ fields: ['OBJETIVO', 'DESCRIPCION'], ignoreCase: true, operator: 'contains' }}
                    width="auto"
                    height="auto"
                    allowTextWrap={true}
                    textWrapSettings={{ wrapMode: 'Both' }}
                    locale='esp'
                >
                    <ColumnsDirective>
                        {requirementsGrid.map((item, index) => (
                            <ColumnDirective key={`c-${index}`} {...item} />
                        ))}
                    </ColumnsDirective>

                    <Inject services={[Page, Search, Toolbar, Edit]} />
                </GridComponent>
            </div>

            {/* Modal para agregar requerimiento */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <Header category="App" title="Agregar Requerimiento" />
                        {fechasproject[0].ESTADO === "En espera" && <div>No puedes asignar requerimientos</div>}
                        {fechasproject[0].ESTADO === "Finalizado" && <div>No puedes asignar requerimientos</div>}
                        {fechasproject[0].ESTADO === "En desarrollo" && entregaactual && (
                            <form onSubmit={selectedReq ? handleSubmit(handleSaveEdit) : handleSubmit(onSubmit)} className='m-3'>
                                <div className="mb-1">
                                    <label className={styles.labels}>Objetivo:<span className='text-sm font-semibold text-red-800'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        name="OBJETIVO"
                                        placeholder="objetivo del requerimiento"
                                        {...register("OBJETIVO", { required: true, message: "Campo Requerido" })}
                                    />
                                    {errors.OBJETIVO && (
                                        <div className="p-2">
                                            <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.OBJETIVO.message}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-1">
                                    <label className={styles.labels}>Descripción:<span className='text-sm font-semibold text-red-800'>*</span></label>
                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        name="DESCRIPCION"
                                        rows="3"
                                        placeholder='describe el requerimiento'
                                        {...register("DESCRIPCION", { required: true, message: "Campo Requerido" })}
                                    />
                                    {errors.DESCRIPCION && (
                                        <div className="p-2">
                                            <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.DESCRIPCION.message}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-1">
                                    <label className={styles.labels}>Tipo de Requerimiento:<span className='text-sm font-semibold text-red-800'>*</span></label>
                                    <select
                                        {...register("TIPO", { required: true, message: "Campo Requerido" })}
                                        className='form-select'
                                    >
                                        <option value="0">Selecciona el tipo de requerimiento</option>
                                        <option value="1">Requerimiento Funcional</option>
                                        <option value="2">Requerimiento No Funcional</option>
                                        <option value="3">Requerimiento de Rendimiento</option>
                                        <option value="4">Requerimiento de Seguridad</option>
                                        <option value="5">Requerimiento de Calidad</option>
                                        <option value="6">Solicitud de Cambio</option>
                                    </select>
                                    {errors.TIPO && (
                                        <div className="p-2">
                                            <div className="items-center bg-red-100 text-red-700 rounded-lg m-2 shadow-md">{errors.TIPO.message}</div>
                                        </div>
                                    )}
                                </div>
                                <div className='mt-3 row'>
                                    <div className='mt-3 d-flex justify-content-center'>
                                        {selectedReq ? (
                                            <button className="btn btn-primary">Guardar</button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">Agregar</button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Requerimientos;