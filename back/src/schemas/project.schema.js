import { z } from 'zod';

export const createSchema = z.object({
    NOMBRE_PROYECTO: z.string().nonempty({
        required_error: 'El nombre del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Nombre de proyecto invalido" }
    ),
    OBJETIVO: z.string().nonempty({
        required_error: 'El objetivo del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Objetivo invalido" }
    ),
    DESCRIPCION_GNRL: z.string().nonempty({
        required_error: 'El descripcion del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    FECHA_INICIO: z.string().nonempty({
        required_error: 'La fecha de inicio es requerida'
    }),
    FECHA_TERMINO: z.string().nonempty({
        required_error: 'La fecha de termino es requerda'
    }),
    ENTREGAS: z.string().nonempty({
        required_error: 'Las entregas son requeridas'
    })
})



export const joinSchema = z.object({
    CODIGO_UNIRSE: z.string().nonempty({
        required_error: 'El codigo es requerido'
    }).regex(
        new RegExp(/^[A-Z0-9]{5}$/), {message: "Código inválido"}
    )
})

export const taskSchema = z.object({
    NOMBRE: z.string().nonempty({
        required_error: 'El nombre es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    DESCRIPCION: z.string().nonempty({
        required_error: 'El descripcion del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    FECHA_INICIO: z.string().nonempty({
        required_error: 'La fecha de inicio es requerida'
    }),
    FECHA_MAX_TERMINO:z.string().nonempty({
        required_error: 'La fecha max es requerida'
    }),
    HORAINICIO:z.string().nonempty({
        required_error: 'La hora inicio es requerida'
    }),
    HORAMAXIMA:z.string().nonempty({
        required_error: 'La hora max es requerida'
    }),
    ID_REQUERIMIENTO:z.string().nonempty({
        required_error: 'El requerimiento es requerido'
    }),
    ROLPARTICIPANTE:z.string().nonempty({
        required_error: 'El rol es requerido'
    }),
    ID_USUARIO:z.string().nonempty({
        required_error: 'El id de usuario es requerido'
    }),
    ID_TAREA_DEPENDIENTE: z.string().optional()

});