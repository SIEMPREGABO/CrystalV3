import styles from '../css/voicereq.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { useStateContext } from '../context/Provider.js';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useForm } from 'react-hook-form';
import { useProject } from "../context/projectContext.js";
import { zodResolver } from '@hookform/resolvers/zod';
import { requerimientoSchema } from '../schemas/project.js';
import { Header } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import {
    GridComponent, ColumnsDirective, ColumnDirective, Inject, Page, Search, Toolbar, Edit, DialogEditEventArgs
} from '@syncfusion/ej2-react-grids';
import { L10n } from '@syncfusion/ej2-base';

const requirementsGrid = [
    { field: "ID", headerText: "ID", width: "100", textAlign: "center", headerTextAlign: "center", visible: false },
    { field: "ENTREGA", headerText: "Entrega", width: "100", textAlign: "center", headerTextAlign: "center" },
    { field: "OBJETIVO", headerText: "Objetivo", width: "200", textAlign: "left", headerTextAlign: "center" },
    { field: "DESCRIPCION", headerText: "Descripcion", width: "200", textAlign: "left", headerTextAlign: "center" },
    { field: "NOMBRE", headerText: "Tipo Requerimiento", width: "100", textAlign: "center", headerTextAlign: "center" },
];

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
    const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();
    const modalRef = useRef(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [reqObj, setReqObj] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idRequierement, setIdRequirement] = useState(0);
    const [selectedReq, setSelectedReq] = useState(null);
    const [reqLocal, setReqLocal] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        resolver: zodResolver(requerimientoSchema)
    });

    const { createRequirements, entregaactual, fechasproject, projecterrors, message, requirements } = useProject();

    useEffect(() => {
        console.log(requirements);
    }, []);

    useEffect(() => {
        setReqLocal(requirements);
    }, [requirements]); // Asegúrate de poner [requirements] para que se ejecute solo cuando requirements cambie

    const onSubmit = handleSubmit(async (values) => {
        const data = {
            OBJETIVO: values.OBJETIVO,
            DESCRIPCION: values.DESCRIPCION,
            TIPO: values.TIPO,
            ID_ENTREGA: entregaactual.ID
        };
        let tr = "";
        if(values.TIPO === "1"){
            tr= "Funcional";
        }else if(values.TIPO === "2"){
            tr="No Funcional";
        }else if(values.TIPO === "3"){
            tr="Rendimiento";
        }else if(values.TIPO === "4"){
            tr="Seguridad";
        }else if(values.TIPO === "5"){
            tr= "Calidad";
        }else{
            tr="Cambio";
        }
        const dataLocal = {
            ENTREGA: entregaactual.ID,
            OBJETIVO: values.OBJETIVO,
            DESCRIPCION: values.DESCRIPCION,
            NOMBRE: tr,
        }

        console.log(data);
        setReqLocal((prevdata) => [...prevdata, dataLocal]);
        createRequirements(data);
    });

    const handleEditDialogOpen = () => {
        setIsEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        console.log("Hola");
        setIsEditDialogOpen(false);
    };

    const handlePlusClick = (props) => {
        /*setSelectedRequirement(props);
        setValue('OBJETIVO', props.OBJETIVO);
        setValue('DESCRIPCION', props.DESCRIPCION);
        setValue('TIPO', props.TIPO);
        setIsModalOpen(true);*/
    };

    const handleTrashClick = (props) => {
        console.log(props);
        alert(`Eliminar elemento en la fila con ID: ${props.ID}`);
    };

    const actionTemplate = (props) => {
        return (
            <div className='w-full flex justify-around '>
                <span data-toggle="tooltip" title="Editar">
                    <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="fa-icon"
                        style={{ marginRight: '10px', cursor: 'pointer', color: '#186e8b', fontSize: '1.25rem' }}
                        onClick={() => handlePlusClick(props)}
                    />
                </span>
                <span data-toggle="tooltip" title="Eliminar">
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="fa-icon"
                        style={{ cursor: 'pointer', color: '#f70808', fontSize: '1.25rem' }}
                        onClick={() => handleTrashClick(props)}
                    />
                </span>
            </div>
        );
    };

    const handleDeleteClick = () => {
        console.log("Boton Eliminar");
    }

    const handleSaveClick = () => {
        console.log("Guardar Click");
    }

    const handleRowDoubleClick = (args) => {
        const gridObj = document.getElementById('reqs').ej2_instances[0];
        gridObj.closeEdit();
        console.log(args.rowData);
        setIsEditDialogOpen(true);
        setSelectedReq(args.rowData);
    };

    return (
        <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category="App" title="REQUERIMIENTOS" />
            <div className='m-3 w-full flex'>
                <div className='w-6/12'></div>
                <div className='w-6/12 flex justify-end mr-7'>
                    <button className='p-1 w-fit rounded-xl border-1 border-blue-700 flex justify-center ' data-bs-toggle="modal" data-bs-target="#exampleModal">
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
                    recordDoubleClick={(args) => handleRowDoubleClick(args)}
                    style={{zIndex: 1000}}
                >
                    <ColumnsDirective>
                        {requirementsGrid.map((item, index) => (
                            <ColumnDirective key={`c-${index}`} {...item} />
                        ))}
                    </ColumnsDirective>
                    <Inject services={[Page, Search, Toolbar, Edit]} />
                </GridComponent>

                <DialogComponent
                    id="req_dialog"
                    header='Detalles de Requerimiento'
                    width='800px'
                    zIndex={2000}// Ajusta el zIndex según sea necesario
                    showCloseIcon={true}
                    close={handleEditDialogClose}
                    closeOnEscape={true}
                    visible={isEditDialogOpen}
                    style={{ maxHeight: '600px', height: '500px !important', top: '30%'}}
                >
                    {/* Contenido del diálogo aquí */}
                    <form className='h-full'>
                        <input type="text" id="ID" name="ID" className='hidden' />
                        <div className="input-group mb-3 flex items-center ">
                            <label htmlFor="objetivo" className='block text-sm font-semibold text-gray-800'>Objetivo: </label>
                            <input
                                className="w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                placeholder="Objetivo"
                                aria-label="objetivo"
                                id="objetivo"
                                name='objetivo'
                                spellCheck={false}
                                value={selectedReq !== null ? selectedReq.OBJETIVO : ""}
                                
                            />
                        </div>
                        <div className="input-group mb-3 flex items-center ">
                            <label htmlFor="desc" className='block text-sm font-semibold text-gray-800'>Descripcion: </label>
                            <textarea
                                spellCheck={false}
                                className="w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                placeholder="Descripcion de requerimiento"
                                rows={4}
                                aria-label="Username"
                                id="desc"
                                name='desc'
                                value={selectedReq !== null ? selectedReq.DESCRIPCION : ""}
                                
                            ></textarea>
                        </div>
                        <div className="input-group mb-3 flex items-center ">
                            <label htmlFor="tipo_req" className='block text-sm font-semibold text-gray-800'>Tipo de Requerimiento: </label>
                            <select
                                id="tipo_req"
                                name='tipo_req'
                                value={selectedReq !== null ? selectedReq.NOMBRE : ""}
                                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Funcional">Funcional</option>
                                <option value="No Funcional">No funcional</option>
                                <option value="Calidad">Calidad</option>
                                <option value="Desempeño">Desempeño</option>
                                <option value="Cambio">Cambio</option>
                            </select>
                        </div>
                        <div className="e-footer-content">
                            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-delete" onClick={handleDeleteClick}>Eliminar</button>
                            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-edit e-primary" onClick={handleSaveClick}>Guardar</button>
                            <button type="button" className="e-control e-btn e-lib e-flat e-dialog-cancel" onClick={handleEditDialogClose}>Cancelar</button>
                        </div>
                    </form>
                </DialogComponent>
            </div>

            {/* Modal para agregar requerimiento */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{zInde:1000}}>
                        <Header category="App" title="Agregar Requerimiento" />
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
                            <>
                                {entregaactual !== "" &&
                                    <form onSubmit={handleSubmit(onSubmit)} className='m-3'>
                                        <div className="mb-1">
                                            <label className={styles.labels}>Objetivo: </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                name="OBJETIVO"
                                                placeholder="objetivo del requerimiento"
                                                {...register("OBJETIVO", { required: true, message: "Campo Requerido" })}
                                            />
                                            {errors.OBJETIVO &&
                                                <div className="p-2">
                                                    <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.OBJETIVO.message}</div>
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-1">
                                            <label className={styles.labels}>Descripción: </label>
                                            <textarea
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                name="DESCRIPCION"
                                                rows="3"
                                                placeholder='describe el requerimiento'
                                                {...register("DESCRIPCION", { required: true, message: "Campo Requerido" })}
                                            />
                                            {errors.DESCRIPCION &&
                                                <div className="p-2">
                                                    <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.DESCRIPCION.message}</div>
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-1">
                                            <label className={styles.labels}>Tipo de Requerimiento: </label>
                                            <select
                                                {...register("TIPO", { required: true, message: "Campo Requerido" })}
                                                className='form-select'
                                                defaultValue="0"
                                            >
                                                <option value="0">Selecciona el tipo de requerimiento</option>
                                                <option value="1">Requerimiento Funcional</option>
                                                <option value="2">Requerimiento No Funcional</option>
                                                <option value="3">Requerimiento de Rendimiento</option>
                                                <option value="4">Requerimiento de Seguridad</option>
                                                <option value="5">Requerimiento de Calidad</option>
                                                <option value="6">Solicitud de Cambio</option>
                                            </select>
                                            {errors.TIPO &&
                                                <div className="p-2">
                                                    <div className=" items-center bg-red-100 text-red-700  rounded-lg m-2 shadow-md ">{errors.TIPO.message}</div>
                                                </div>
                                            }
                                        </div>
                                        <div className='mt-3 row'>
                                            <div className='mt-3 d-flex justify-content-center'>
                                                <button type="submit" className="btn btn-primary">Agregar</button>
                                            </div>
                                        </div>
                                    </form>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Requerimientos;