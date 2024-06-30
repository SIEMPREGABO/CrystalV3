import z from 'zod';

//Hacer un schema para proyectos
export const projectSchema = z.object({
    NOMBRE_PROYECTO: z.string().nonempty({
        message: 'El nombre del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Nombre de proyecto inválido" }
    ),
    OBJETIVO: z.string().nonempty({
        message: 'El objetivo del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Objetivo inválido" }
    ),
    DESCRIPCION_GNRL: z.string().nonempty({
        message: 'El descripción del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Descripción invalida" }
    ),
    MATERIA_PROYECTO: z.string().nonempty({
        message: 'La materia objetivo del proyecto es requerida'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Nombre de materia inválido" }
    ),
    FECHA_INICIO: z.string().nonempty({
        message: 'La fecha de inicio es requerida'
    }),
    FECHA_TERMINO: z.string().nonempty({
        message: 'La fecha de termino es requerida'
    }),
    ENTREGAS: z.string().nonempty({
        message: 'Las entregas son requeridas'
    }).refine(value => value !== "0", {
        message: 'Selecciona un número de entregas'
    }), ITERACIONES: z.string().optional()
})

export const joinSchema = z.object({
    CODIGO_UNIRSE: z.string().nonempty({
        message: 'El codigo es requerido'
    }).regex(
        new RegExp(/^[A-Z0-9]{5}$/), { message: "Código inválido" }
    )
})

export const addSchema = z.object({
    CORREO: z.string().nonempty({
        message: "El email es requerido"
    }).regex(
        new RegExp(/^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/),{ message: 'Correo inválido' }
    )
})

export const taskSchema = z.object({
    NOMBRE: z.string().nonempty({
        message: 'El nombre de la tarea es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Nombre inválido" }
    ),
    DESCRIPCION: z.string().nonempty({
        message: 'La descripción de la tarea es requerida'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Descripción inválida" }
    ),
    FECHA_INICIO: z.string().nonempty({
        message: 'La fecha de inicio es requerida'
    }),
    FECHA_MAX_TERMINO:z.string().nonempty({
        message: 'La fecha de termino es requerida'
    }),
    HORAINICIO:z.string().nonempty({
        message: 'La hora inicio es requerida'
    }),
    HORAMAXIMA:z.string().nonempty({
        message: 'La hora de termino es requerida'
    }),
    ID_REQUERIMIENTO:z.string().nonempty({
        message: 'El requerimiento es requerido'
    }).refine(value => value !== "0", {
        message: 'Selecciona un tipo de requerimiento'
    }),
    ROLPARTICIPANTE:z.string().nonempty({
        message: 'El rol es requerido'
    }).refine(value => value !== "0", {
        message: 'Selecciona un tipo de rol'
    }),
    ID_USUARIO:z.string().nonempty({
        message: 'El usuario es requerido'
    }).refine(value => value !== "0", {
        message: 'Selecciona un usuario'
    }),ID_TAREA_DEPENDIENTE: z.string().optional()
});

export const updateTaskSchema = z.object({
    NOMBREU: z.string().nonempty({
        message: 'El nombre de la tarea es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Nombre inválido" }
    ),
    DESCRIPCIONU: z.string().nonempty({
        message: 'La descripción de la tarea es requerida'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Descripción inválida" }
    ),
    FECHA_INICIOU: z.string().nonempty({
        message: 'La fecha de inicio es requerida'
    }),
    FECHA_MAX_TERMINOU:z.string().nonempty({
        message: 'La fecha de termino es requerida'
    }),
    HORAINICIOU:z.string().nonempty({
        message: 'La hora inicio es requerida'
    }),
    HORAMAXIMAU:z.string().nonempty({
        message: 'La hora de termino es requerida'
    }),
    ROLPARTICIPANTEU:z.string().nonempty({
        message: 'El rol es requerido'
    }).refine(value => value !== "0", {
        message: 'Selecciona un tipo de rol'
    }),
    ESTADOU:z.string().nonempty({
        message: 'El estado de desarrollo es requerido'
    }).refine(value => value !== "0", {
        message: 'Selecciona un estado de desarrollo'
    }),
});

export const collabSchema =  z.object({
    ROLPARTICIPANTEC: z.string().nonempty({
        message: 'El rol del colaborador es requerido'
    }).refine( value => value !== "0", {
        message: 'Selecciona un rol para el colaborador'
    }),
    ID_USUARIOC: z.string().nonempty({
        message: 'El colaborador es requerido'
    }).refine( value => value !== "0", {
        message: 'Selecciona un colaborador para esta tarea'
    }),
})

export const requerimientoSchema = z.object({
    OBJETIVO: z.string().nonempty({
        message: 'El objetivo es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Objetivo inválido" }
    ),
    DESCRIPCION: z.string().nonempty({
        message: 'La descripción es requerida'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Descripción invalida" }
    ),
    TIPO: z.string().nonempty({
        message: 'El tipo es requerido'
    }).refine(value => value !== "0", {
        message: 'Selecciona un tipo de requerimiento'
    })
})

export const requerimientoxVozSchema = z.object({
    REQUERIMIENTO: z.string().nonempty({
        message: 'El requerimiento es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9.,!?¿¡-]+$/), { message: "Requerimiento inválido" }
    )
})