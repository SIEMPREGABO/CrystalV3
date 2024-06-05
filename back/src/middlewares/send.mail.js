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
        subject: `Te han agregado a un proyecto ${PROYECTO.NOMBRE}, visualiza tu panel `, 
        html: `<div>
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

export async function sendemailConfig(Proyecto, CORREO){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Configuración de '${Proyecto}' actualizada`, 
        html: `<div>
        <p>Se han actualizado las fechas de tu proyecto</p>
        <p>Revisalas en la pestaña calendario de tu proyecto en Clear/p>
        <p> =D </p>
        </div>`
    });
}

export async function sendemailAdmin(Proyecto, CORREO){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Se ha unido un usuario a tu proyecto '${Proyecto.NOMBRE}'`, 
        html: `<div>
        <p>Dale un vistazo a tus participantes en tu proyecto</p>
        <p>En Clear/p>
        <p> =D </p>
        </div>`
    });
}

export async function sendemailUpdateTask(NOMBRE, CORREO, DESCRIPCION, ESTADO_DESARROLLO, FECHA_INICIO, FECHA_MAX_TERMINO){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Tu tarea '${NOMBRE}' fue actualizada`, 
        html: `<div>
        <p>Se ha actualizado tu tarea</p>
        <p>Descripción: ${DESCRIPCION}</p>
        <p>Estado:${ESTADO_DESARROLLO} /p>
        <p>Fecha de inicio:${FECHA_INICIO} /p>
        <p>Fecha de termino:${FECHA_MAX_TERMINO} </p>
        <p> =D </p>
        </div>`
    });
}


export async function sendemailDeleteTask(NOMBRE, CORREO, DESCRIPCION){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Tu tarea '${NOMBRE}' fue eliminada`, 
        html: `<div>
        <p>Se ha eliminado tu tarea</p>
        <p>Descripción: ${DESCRIPCION}</p>
        <p> =D </p>
        </div>`
    });
}


export async function sendemailStartProject(NOMBRE, CORREO, OBJETIVO, DESCRIPCION_GNRL){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Tu proyecto '${NOMBRE}' ha comenzado`, 
        html: `<div>
        <p>Tu proyecto en clear ha iniciado</p>
        <p>Descripción: ${DESCRIPCION_GNRL}</p>
        <p>Objetivo: ${OBJETIVO}</p>
        <p> =D </p>
        </div>`
    });
}

export async function sendemailEndProject(NOMBRE, CORREO, OBJETIVO, DESCRIPCION_GNRL){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Tu proyecto '${NOMBRE}' ha terminado`, 
        html: `<div>
        <p>Tu proyecto en clear ha terminado</p>
        <p>Descripción: ${DESCRIPCION_GNRL}</p>
        <p>Objetivo: ${OBJETIVO}</p>
        <p> =D </p>
        </div>`
    });
}

export async function sendemailDeleteProject(NOMBRE, CORREO, OBJETIVO, DESCRIPCION_GNRL){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Tu proyecto '${NOMBRE}' ha sido eliminado`, 
        html: `<div>
        <p>Tu proyecto en clear ha sido eliminado</p>
        <p>Descripción: ${DESCRIPCION_GNRL}</p>
        <p>Objetivo: ${OBJETIVO}</p>
        <p> =D </p>
        </div>`
    });
}


export async function sendemailFaseProject(NOMBRE, CORREO, OBJETIVO, DESCRIPCION_GNRL){
    return await transporter.sendMail({
        from: '"Clear 👻" <clear@gmail.com>', 
        to: CORREO, 
        subject: `Tu proyecto '${NOMBRE}' ha cambiado de fase`, 
        html: `<div>
        <p>Tu proyecto en clear ha cambiado de fase</p>
        <p>Descripción: ${DESCRIPCION_GNRL}</p>
        <p>Objetivo: ${OBJETIVO}</p>
        <p> =D </p>
        </div>`
    });
}