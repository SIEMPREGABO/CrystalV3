import { promise } from "zod";
import { getConnection } from "../database.js";

export function verificarUsuario(CORREO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'SELECT ID, CORREO, NOMBRE_USUARIO,CONTRASENIA, FECHA_CREACION,NOMBRE_PILA,APELLIDO_PATERNO,APELLIDO_MATERNO,TELEFONO,NUMERO_BOLETA  FROM USUARIO WHERE CORREO = ? ';
        connection.query(query, [CORREO], (err, results) => {
            if (err) {
                reject(err);
            } else {  
                if (results.length > 0) {
                    resolve({success:true, userData:results});
                } else {
                    resolve(false);
                }
            }
        });
    });
};

export function actualizarUsuarioNombre(NOMBRE_USUARIO,NUMERO_BOLETA,NOMBRE_PILA,APELLIDO_PATERNO,APELLIDO_MATERNO,TELEFONO, CORREO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'UPDATE USUARIO SET NOMBRE_USUARIO = ?, NOMBRE_PILA = ?, APELLIDO_PATERNO = ?, APELLIDO_MATERNO = ?, TELEFONO = ?, NUMERO_BOLETA = ? WHERE CORREO = ?';
        connection.query(query, [NOMBRE_USUARIO,NOMBRE_PILA,APELLIDO_PATERNO,APELLIDO_MATERNO,TELEFONO,NUMERO_BOLETA,CORREO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: "No se encontró ningún registro para actualizar" });
                }
            }
        });
    });
};

export function actualizarUsuario(NUMERO_BOLETA,NOMBRE_PILA,APELLIDO_PATERNO,APELLIDO_MATERNO,TELEFONO, CORREO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'UPDATE USUARIO SET NOMBRE_PILA = ?, APELLIDO_PATERNO = ?, APELLIDO_MATERNO = ?, TELEFONO = ?, NUMERO_BOLETA = ? WHERE CORREO = ?';
        connection.query(query, [NOMBRE_PILA,APELLIDO_PATERNO,APELLIDO_MATERNO,TELEFONO,NUMERO_BOLETA,CORREO], (err, results) => {
            if (err) {
                reject(err);
            }  else {
                if (results.affectedRows > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: "No se encontró ningún registro para actualizar" });
                }
            }
        });
    });
};


export function correoUsuario(CORREO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'SELECT NOMBRE_USUARIO FROM USUARIO WHERE CORREO = ? ';
        connection.query(query, [CORREO], (err, results) => {
            if (err) {
                reject(err);
            } else {  
                if (results.length > 0) {
                    resolve({success:true, userData:results});
                } else {
                    resolve(false);
                }
            }
        });
    });
};

export function verificarNombre(Nombre) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();

        const query = 'SELECT ID, CORREO, NOMBRE_USUARIO,CONTRASENIA, FECHA_CREACION FROM USUARIO WHERE NOMBRE_USUARIO = ? ';
        
        connection.query(query, [Nombre], (err, results) => {
            if (err) {
                reject(err);
            } else {  
                if (results.length > 0) {
                    resolve({success:true, userData:results});
                } else {
                    resolve(false);
                }
            }
        });
    });
};

export function cambiarContrasenia(ID,CONTRASENIA){
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();

        const query = 'UPDATE USUARIO SET CONTRASENIA = ? WHERE ID = ?';
        //console.log(ID,CONTRASENIA);
        connection.query(query, [CONTRASENIA, ID], (err, results) => {
            if (err) {
                //console.log("faie");
                reject(err);
            } else {  
                //console.log("no faie")
                if (results.affectedRows > 0) {
                    resolve({ success: true, message: 'Contraseña actualizada correctamente' });
                } else {
                    resolve({ success: false, message: 'Error al actualizar la contraseña' });
                }
            }
        });
    });
}

export function agregarUsuario(CORREO, NOMBRE_USUARIO, CONTRASENIA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, NUMERO_BOLETA) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        //const insertarQuery = `INSERT INTO USUARIO (CORREO, NOMBRE_USUARIO, CONTRASENIA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, NUMERO_BOLETA,FECHA_CREACION) 
        //VALUES (?, ?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), '+00:00', '-06:00'))`;
        const insertarQuery = `INSERT INTO USUARIO (CORREO, NOMBRE_USUARIO, CONTRASENIA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, NUMERO_BOLETA,FECHA_CREACION) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), '+00:00', '-06:00'))`;

        connection.query(insertarQuery,[CORREO, NOMBRE_USUARIO, CONTRASENIA, NOMBRE_PILA, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, NUMERO_BOLETA],
            (insertarErr, insertarResults) => {
                if (insertarErr) {
                    reject(insertarErr);
                } else {
                    resolve(true);
                }
            }
        );
    });
};

export function extraerUsuario(CORREO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'SELECT ID,NOMBRE_PILA,TELEFONO,APELLIDO_PATERNO,APELLIDO_MATERNO, NOMBRE_USUARIO, FECHA_CREACION, CORREO, NUMERO_BOLETA FROM USUARIO WHERE CORREO = ? ';
        connection.query(query, [CORREO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

export function autenticarUsuario(ID) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'SELECT ID,NOMBRE_USUARIO,TELEFONO ,NUMERO_BOLETA,NOMBRE_PILA,APELLIDO_PATERNO,APELLIDO_MATERNO, CORREO, FECHA_CREACION FROM USUARIO WHERE ID = ?';
        connection.query(query, [ID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve({success:true, userData:results});
                } else {
                    resolve(false);
                }
            }
        });
    });
};

export function actualizarPass(CORREO,CONTRASENIA){
    return new Promise(async (resolve, reject)=>{
        const connection = await getConnection();
        const query = 'UPDATE USUARIO SET CONTRASENIA = ? WHERE CORREO = ?';
        connection.query(query, [CONTRASENIA, CORREO], (err, results) =>{
            if (err) {
                reject({success:false, error:err});
            } else {
                resolve({success:true, userData:results});
            }
        })
    });
}

export function getMensajes(){
    return new promise(async (resolve, reject) =>{
        const connection = await getConnection();
        const query = 'SELECT * FROM MENSAJES';
        connection.query(query, (err,results) => {
            if(err){
                err({success:false, error: err});
            }else{
                if(results.length == 0){
                    results({
                        success: true,
                        vacio: true
                    })
                }else{
                    results({
                        success: true,
                        vacio: false,
                        mensajes: results
                    })
                }
            }
        })
    })
}


export function getTasks(){
    return new promise(async (resolve, reject) =>{
        const connection = await getConnection();
        const query = 'SELECT * FROM TASKS';
        connection.query(query, (err,results) => {
            if(err){
                err({success:false, error: err});
            }else{
                if(results.length == 0){
                    results({
                        success: true,
                        vacio: true
                    })
                }else{
                    results({
                        success: true,
                        vacio: false,
                        mensajes: results
                    })
                }
            }
        })
    })
}

export function getTask(ID){
    return new promise(async (resolve,reject) =>{
        const connection = await getConnection();
        const query = 'SELECT * FROM TASK WHERE ID = ?';
        connection.query(query, [ID], (err,results)=> {
            if(reject){
                reject({success: false, error: err});
            }else{
                results({success:true, tasks:results});
            }
        })
    })
}

export function projectsUsuario(ID){
    return new promise(async (resolve,reject) =>{
        const connection = await getConnection();
        const query = 'SELECT * FROM PROYECTOS WHERE ID = ?';
        connection.query(query, [ID], (err,results)=> {
            if(reject){
                reject({success: false, error: err});
            }else{
                results({success:true, projects:results});
            }
        })
    })
}