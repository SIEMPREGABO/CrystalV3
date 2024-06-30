import { Router } from "express";
import { validarToken } from "../middlewares/validate.token.js";
import { 
    getTasks, createTask, createProject, getProjects, joinProject,
    getProject, getPermissions, agregarRequerimiento, agregarMensaje, 
    getMessages, addParticipant,deleteParticipant, getTareasxIteracion,
    configurarProyecto, deleteTask, updateTask, updateTaskState, delegarParticipant, 
    deleteProject,
    degradarParticipant,
    ascenderParticipant,
    cambiarEstado,
    agregarColaboradorTarea,
    eliminarColaboradorTarea,
    setObjetivo,
    setRetroalimentacion,
    actualizarRequerimiento,
    eliminarRequerimiento,
    chatsIteraciones,
    actualizarProyecto,
    crearProyectoManual 
} from "../controllers/project.controller.js";
import { createSchema, joinSchema, taskSchema, addSchema, requerimientoSchema, collabSchema } from "../schemas/project.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router  = Router();

router.post('/createProject',validateSchema(createSchema), createProject);
router.post('/createProjectM',crearProyectoManual);
router.post('/configProject', configurarProyecto);
router.post('/deleteProject', deleteProject);
router.post('/joinProject',validateSchema(joinSchema),joinProject);
router.post('/addParticipant',validateSchema(addSchema),addParticipant);
router.post('/delegarParticipant',delegarParticipant);
router.post('/degradarParticipant',degradarParticipant);
router.post('/ascenderParticipant',ascenderParticipant);
router.post('/deleteParticipant',deleteParticipant);
router.get('/getProjects' ,getProjects);
router.post('/getProject', getProject);
router.post('/getPermissions', getPermissions);
router.post('/getProjectTasks', getTareasxIteracion);
router.post('/addRequirement', validateSchema(requerimientoSchema), agregarRequerimiento); 
router.get('/tasks', validarToken ,getTasks);
router.post('/createTask',validateSchema(taskSchema),createTask);
router.post('/updateTask',updateTask); 
router.post('/updateState', updateTaskState);
router.post('/deleteTask', deleteTask);
router.post('/addMessage', agregarMensaje);
router.post('/getMessages', getMessages);
router.post('/addCollab', validateSchema(collabSchema),agregarColaboradorTarea);
router.post('/deleteCollab', eliminarColaboradorTarea);
router.post('/changeState', cambiarEstado);
router.post('/setObjetivo', setObjetivo);
router.post('/setRetroalimentacion', setRetroalimentacion);
router.post('/updateRequirement', actualizarRequerimiento);
router.post('/deleteRequirement', eliminarRequerimiento);
router.post('/chatsIteraciones', chatsIteraciones);
router.post('/updateProject', actualizarProyecto);



export default router;