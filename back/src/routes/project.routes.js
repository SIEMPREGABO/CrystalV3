import { Router } from "express";
import { validarToken } from "../middlewares/validate.token.js";
import { getTasks, createTask, createProject, getProjects, 
    joinProject,getProject, getPermissions, agregarRequerimiento, agregarMensaje, getMessages, 
    addParticipant,
    deleteParticipant, getTareasxIteracion,
    configurarProyecto, deleteTask, updateTask, updateTaskState,
    delegarParticipant,
    deleteProject} from "../controllers/project.controller.js";
import { createSchema, joinSchema, taskSchema } from "../schemas/project.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router  = Router();

router.post('/createProject',validateSchema(createSchema), createProject)
router.get('/getProjects' ,getProjects);
router.post('/joinProject',validateSchema(joinSchema),joinProject);
router.post('/addParticipant',addParticipant); //schema
router.post('/delegarParticipant',delegarParticipant);
router.post('/deleteParticipant',deleteParticipant);
router.post('/getPermissions', getPermissions);
router.post('/addRequirement', agregarRequerimiento); //schema
router.post('/getProject', getProject);
router.get('/tasks', validarToken ,getTasks);
router.post('/createTask',validateSchema(taskSchema),createTask);
router.post('/deleteTask', deleteTask);
router.post('/updateTask', updateTask); //schema
router.post('/updateState', updateTaskState);
router.post('/addMessage', agregarMensaje);
router.post('/getMessages', getMessages);
router.post('/getProjectTasks', getTareasxIteracion);
router.post('/configProject', configurarProyecto);
router.post('/deleteProject', deleteProject);

export default router;