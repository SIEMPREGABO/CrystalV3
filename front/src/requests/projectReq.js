import axios from './axios.js';

export const requestCreate = async project => axios.post(`/createProject`,project);
export const requestJoin = async joinable => axios.post(`/joinProject`,joinable);
export const requestAdd = async participant => axios.post(`/addParticipant`, participant);
export const requestProjects = async () => axios.get(`/getProjects`);
export const requestPermissions = async id => axios.post(`/getPermissions`, id);
export const requestgetProject = async id => axios.post(`/getProject`, id);
export const requestCreateTask = async task => axios.post(`/createTask`,task);
export const requestAddRequirement = async project => axios.post('/addRequirement', project);
export const requestAddMessage = async message => axios.post('/addMessage', message);
export const requestMessages = async iteracion => axios.post('/getMessages', iteracion);
export const requestDelete = async id => axios.post('/deleteParticipant', id);
export const requestDelegar = async id => axios.post('/delegarParticipant', id);
export const requestAscender = async id => axios.post('/ascenderParticipant', id);
export const requestDegradar = async id => axios.post('/degradarParticipant', id);
export const requestTasksProject = async project => axios.post('/getProjectTasks', project);
export const requestConfig = async fechas => axios.post(`/configProject`,fechas);
export const requestDeleteTask = async task => axios.post('/deleteTask', task);
export const requestUpdateTask = async task => axios.post('/updateTask', task);
export const requestUpdateTState = async task => axios.post('/updateState', task);
export const requestDeleteProject = async id => axios.post('/deleteProject',id)