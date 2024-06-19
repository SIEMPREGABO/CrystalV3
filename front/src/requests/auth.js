import axios from './axios.js';

export const requestLogin = async user => axios.post(`/login`,user);
export const requestRegister = async user => axios.post(`/register`,user);
export const requestVerify = async () => axios.get(`/verify`);
export const requestLogout = () => axios.post(`/logout`);
export const requestReset = async user => axios.post(`/reset`,user);
export const requestPass = async user => axios.post("/resetpass",user);
export const requestUpdate = async user => axios.post("/updateuser",user);
export const requestCambiarEstado = async notificaciones => axios.post("/changeState",notificaciones);