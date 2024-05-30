import { transporter } from "../libs/mailer.js";

export async function sendemailReset(email, link){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: email, 
        subject: "¿Olvidaste tu contraseña?", 
        html: `<div>
        <p>Puedes restablecer tu contraseña con el siguiente link: </p>
        <a href="${link}">${link}</a> 
        <p> =D </p>
        </div>`, 
    });
}

export async function sendemailProject(CORREO, NOMBRE_PROYECTO, OBJETIVO, REGISTRO_INICIAL, REGISTRO_FINAL, CODIGO_UNICO){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Creacion de proyecto`, 
        html: `<div>
        <p>Tu proyecto '${NOMBRE_PROYECTO}' se ha creado con exito. </p>
        <p>Objetivo: ${OBJETIVO}. </p>
        <p>Fecha Inicial: ${REGISTRO_INICIAL}. </p>
        <p>Fecha Final: ${REGISTRO_FINAL}.</p>
        <p>Código de unión: ${CODIGO_UNICO}</p>
        <p> =D </p>
        </div>`
    });
}

export async function sendemailRegister(CORREO, NOMBRE_USUARIO){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Bienvenido ${NOMBRE_USUARIO} `, 
        html: `<div>
        <p>Bienvenido al sistema Clear</p>
        <p>Empieza creando tu primer proyecto </p>
        </div>`
    });
}

export async function sendemailJoin(CORREO, PROYECTO){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Bienvenido al proyecto ${PROYECTO.NOMBRE} `, 
        html: `<div>
        <p>Tu proyecto '${PROYECTO.NOMBRE}'</p>
        <p>Objetivo: ${PROYECTO.OBJETIVO}. </p>
        <p>Fecha Inicial: ${PROYECTO.FECHA_INICIO}. </p>
        <p>Fecha Final: ${PROYECTO.FECHA_TERMINO}.</p>
        <p>Código de unión: ${PROYECTO.CODIGO_UNIRSE}</p>
        <p> =D </p>
        </div>`
    });
}

export async function sendemailAdd(CORREO, PROYECTO){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Te han agregado al proyecto ${PROYECTO.NOMBRE} `, 
        html: `<div>
        <p>Tu proyecto '${PROYECTO.NOMBRE}'</p>
        <p>Objetivo: ${PROYECTO.OBJETIVO}. </p>
        <p>Fecha Inicial: ${PROYECTO.FECHA_INICIO}. </p>
        <p>Fecha Final: ${PROYECTO.FECHA_TERMINO}.</p>
        <p> =D </p>
        </div>`
    });
}


export async function sendemailTask(CORREO, NOMBRE, DESCRIPCION,REGISTRO_INICIO, REGISTRO_MAX,ROLPARTICIPANTE){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Tarea asignada '${NOMBRE}' `, 
        html: `<div>
        <p>Se te ha asignado una tarea en tu proyecto</p>
        <p>Tarea: '${NOMBRE}'</p>
        <p>Descripción: ${DESCRIPCION}</p>
        <p>Rol: ${ROLPARTICIPANTE}. </p>
        <p>Fecha Inicial: ${REGISTRO_INICIO}. </p>
        <p>Fecha Final: ${REGISTRO_MAX}.</p>
        <p> =D </p>
        </div>`
    });
}
