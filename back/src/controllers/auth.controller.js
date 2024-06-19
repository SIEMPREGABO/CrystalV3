import bcrypt from 'bcryptjs'
import { createAccessToken, createPasswordToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN, SECRETPASS_TOKEN } from '../config.js';
import { sendemailRegister, sendemailReset } from '../middlewares/send.mail.js';
import { actualizarPass, correoUsuario, agregarUsuario, autenticarUsuario, extraerUsuario, verificarNombre, verificarUsuario, cambiarContrasenia, actualizarUsuario, actualizarUsuarioNombre, verificarBoleta, actualizarEstadoNotificacion  } from '../querys/authquerys.js';
import { getAlerta, getNotificacion, getNotificaciones } from '../querys/projectquerys.js';

import moment from 'moment-timezone';



export const register = async (req, res) => {
    try {
        const { CORREO, NOMBRE_USUARIO, CONTRASENIA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, NUMERO_BOLETA } = req.body;
        //const FECHA_ACTUAL = moment().tz(zonaHoraria);    

        //Verifica si existen el usuario
        const verificar = await verificarUsuario(CORREO);
        if (verificar.success) return res.status(400).json({ message: "Usuario registrado" });

        const verificarUser = await verificarNombre(NOMBRE_USUARIO);
        if (verificarUser.success) return res.status(400).json({ message: "Nombre de usuario registrado" });
        
        const verificarBol = await verificarBoleta(NUMERO_BOLETA);
        if(verificarBol.success) return res.status(400).json({ message: "Boleta registrada" });
        //Encripta la contraseña
        const passwordHash = await bcrypt.hash(CONTRASENIA, 10);

        //Agrega el usuario a la base
        const agregar = await agregarUsuario(CORREO, NOMBRE_USUARIO, passwordHash, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, NUMERO_BOLETA)
        if (!agregar) res.status(500).json({ message: "Error del servidor, intentelo nuevamente" });

        const emailsendend = await sendemailRegister(CORREO,NOMBRE_USUARIO);


        res.json({
            message: "Usuario registrado"
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { CORREO, CONTRASENIA } = req.body;
        //console.log(CORREO, CONTRASENIA);

        //Verifica la existencia del usuario
        const verificar = await verificarUsuario(CORREO);
        if (!verificar.success) return res.status(400).json({ message: "Usuario no registrado" });
        //Compara las contraseñas        
        const isMatch = await bcrypt.compare(CONTRASENIA, verificar.userData[0].CONTRASENIA);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });
        //Crea el token de acceso
        const token = await createAccessToken({ id: verificar.userData[0].ID });
        if (!token) return res.status(500).json({ message: "Error inesperado, intente nuevamente" });
        
        const notificaciones = await getNotificaciones(verificar.userData[0].ID); /////////////////
        let allNotificaciones = [];

        if (notificaciones.length > 0) {
            allNotificaciones = await Promise.all(
                notificaciones.map(async (Notificacion) => {
                    const notificacionData = await getNotificacion(Notificacion.ID_NOTIFICACION);
                    const alerta = await getAlerta(notificacionData[0].ID_TIPO_NOTIFICACION);
                    const combinedData = {
                        ...notificacionData[0], // Copia todas las propiedades de notificacionData
                        ESTADO_VISUALIZACION: Notificacion.ESTADO_VISUALIZACION, // Añade ESTADO_VISUALIZACION
                        PRIORIDAD: alerta[0].PRIORIDAD
                    };
                    return combinedData;
                })
            )
        }
        //Responde con el token y la info del usuario
        res.cookie("token", token);
        res.json({
            ID: verificar.userData[0].ID,
            CORREO: verificar.userData[0].CORREO,
            NOMBRE_USUARIO: verificar.userData[0].NOMBRE_USUARIO,
            FECHA_CREACION: verificar.userData[0].FECHA_CREACION,
            NOMBRE_PILA: verificar.userData[0].NOMBRE_PILA,
            APELLIDO_PATERNO: verificar.userData[0].APELLIDO_PATERNO,
            APELLIDO_MATERNO: verificar.userData[0].APELLIDO_MATERNO,
            TELEFONO: verificar.userData[0].TELEFONO,
            NUMERO_BOLETA: verificar.userData[0].NUMERO_BOLETA,
            FECHA_CREACION: verificar.userData[0].FECHA_CREACION,
            notificaciones: allNotificaciones
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

export const cambiarEstado = async (req, res) => {
    const notificaciones = req.body;
    try {
        await Promise.all(notificaciones.map(async (notificacion)=>{
            //console.log(notificacion.ID);
            await actualizarEstadoNotificacion(notificacion.ID);
        }));
        res.status(200).json({message : "Notificaciones cambiada"});
    } catch (error) {
        res.status(500).json({ message: "Error inesperado, intentalo nuevamente" });
    }
}


export const reset = async (req, res) => {
    try {
        const { CORREO } = req.body;
        //Verifica la existencia del usuario
        const verificar = await verificarUsuario(CORREO);
        if (!verificar.success) return res.status(400).json({ message: "Usuario no registrado" });

        //Crea el token para resetear la contraseña
        const token = await createPasswordToken({ id: verificar.userData[0].ID });
        if (!token) return res.status(500).json({ message: "Error inesperado, intente nuevamente" });

        //Envia el correo con el token
        const emailsendend = await sendemailReset(verificar.userData[0].CORREO, token);
        if (!emailsendend) return res.status(400).json({ message: "Error inesperado, intente nuevamente" })

        //Manda una respuesta al cliente
        res.json({
            message: "Correo enviado a su bandeja de entrada"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const resetpass = async (req, res) => {
    try {
        const { TOKEN, CONTRASENIA } = req.body;
        //console.log(req.body);
        if (!TOKEN) return res.status(401).json({ message: "No autorizado" });
        jwt.verify(TOKEN, SECRETPASS_TOKEN, async (error, user) => {
            if (error) return res.status(401).json({ message: "Token expirado" });
            //console.log(user.id);
            const passwordHash = await bcrypt.hash(CONTRASENIA, 10);
            const cambiar = await cambiarContrasenia(user.id, passwordHash);
            //console.log(cambiar.success);
            if (!cambiar.success) return res.status(500).json({ message: "Error al cambiar la contraseña" });
            return res.json({
                message: "Contraseña cambiada con exito"
            });
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const logout = (req, res) => {
    try {
        const allCookies = req.cookies;
        // Iterar sobre todas las cookies
        Object.keys(allCookies).forEach(cookieName => {
            // Verificar si el nombre de la cookie comienza con "Proyecto"
            if (cookieName.startsWith('Proyecto')) {
                // Si es así, eliminar la cookie
                res.clearCookie(cookieName);
            }
        });
        res.cookie('token', "", { expires: new Date(0) })
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

};


export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No autorizado" });
    jwt.verify(token, SECRET_TOKEN, async (error, user) => {
        if (error) return res.status(401).json({ message: "No autorizado"});
        const verificar = await autenticarUsuario(user.id);
        if (!verificar.success) return res.status(400).json({ message: "No autorizado" });
        return res.json({
            ID: verificar.userData[0].ID,
            CORREO: verificar.userData[0].CORREO,
            NOMBRE_USUARIO: verificar.userData[0].NOMBRE_USUARIO,
            FECHA_CREACION: verificar.userData[0].FECHA_CREACION,
            NOMBRE_PILA: verificar.userData[0].NOMBRE_PILA,
            APELLIDO_PATERNO: verificar.userData[0].APELLIDO_PATERNO,
            APELLIDO_MATERNO: verificar.userData[0].APELLIDO_MATERNO,
            TELEFONO: verificar.userData[0].TELEFONO,
            NUMERO_BOLETA: verificar.userData[0].NUMERO_BOLETA,
            FECHA_CREACION: verificar.userData[0].FECHA_CREACION
        })
    })
}

export const updateUser = async (req, res) => {
    try {
        const { NOMBRE_USUARIO, NUMERO_BOLETA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO } = req.body;
        let actualizar;
        const verificarUser = await correoUsuario(CORREO);
        if (verificarUser.userData[0].NOMBRE_USUARIO == NOMBRE_USUARIO) {
            actualizar = await actualizarUsuario(NUMERO_BOLETA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO);
            if (!actualizar.success) return res.status(500).json({ message: "Error al actualizar los datos"});
        } else {
            const verificarUser = await verificarNombre(NOMBRE_USUARIO);
            if (verificarUser.success) return res.status(400).json({ message:"Nombre de usuario registrado" });
            actualizar = await actualizarUsuarioNombre(NOMBRE_USUARIO, NUMERO_BOLETA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO);
            if (!actualizar.success) return res.status(500).json({ message: "Error al actualizar los datos" });
        }
        const User = await extraerUsuario(CORREO);
        return res.status(200).json({
            ID: User[0].ID,
            NOMBRE_USUARIO: User[0].NOMBRE_USUARIO,
            CORREO: User[0].CORREO,
            FECHA_CREACION: User[0].FECHA_CREACION,
            NUMERO_BOLETA: User[0].NUMERO_BOLETA,
            NOMBRE_PILA: User[0].NOMBRE_PILA,
            APELLIDO_MATERNO: User[0].APELLIDO_MATERNO,
            APELLIDO_PATERNO: User[0].APELLIDO_PATERNO,
            TELEFONO: User[0].TELEFONO
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
