import moment from "moment";
//import { verificarCodigo } from "../querys/projectquerys";
import {verificarCodigo} from '../querys/projectquerys.js';
import { registrarIteracion, registrarEntrega } from "../querys/projectquerys.js";



export function generarEntregas(ENTREGAS, FECHA_INICIAL, FECHA_FINAL,ID_PROYECTO){
        const DIAS_PROYECTO = FECHA_FINAL.diff(FECHA_INICIAL, 'days') + 1;
        const NUMEROENTREGAS = parseInt(ENTREGAS, 10);
        const PARTES = Math.floor(DIAS_PROYECTO / NUMEROENTREGAS);
        const DIAS_RESTANTES = DIAS_PROYECTO % NUMEROENTREGAS;
        const ARRAYPARTES = Array(NUMEROENTREGAS).fill(PARTES);
        let success = false;

        for (let i = 0; i < DIAS_RESTANTES; i++) {
            ARRAYPARTES[i]++;
        }

        let INICIOPARTE = FECHA_INICIAL.clone();
        const FECHAS = [];

        for(let i = 0; i < NUMEROENTREGAS; i++){
            let FINPARTE = INICIOPARTE.clone().add(PARTES - 1, 'days'); 
            if (i < DIAS_RESTANTES){
                FINPARTE.add(1, 'day'); 
            }
            FECHAS.push({ INICIO: INICIOPARTE.format('YYYY-MM-DD'), FIN: FINPARTE.format('YYYY-MM-DD') });
            INICIOPARTE = FINPARTE.clone().add(1, 'day');  
        }

        for(let i=0; i<FECHAS.length;i++){
            //let FIN = moment(ARREGLOPROYECTO[i].FIN).endOf('day').format('YYYY-MM-DD HH:mm:ss');
            success = registrarEntrega("", "En espera", FECHAS[i].INICIO, FECHAS[i].FIN, ID_PROYECTO);
        }
        return success;
}

export async function generarCodigo() {
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    let CODIGO = '';
    for(let i = 0; i<5; i++){
        CODIGO += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    const CODIGOEXISTE = await verificarCodigo(CODIGO);
    if (CODIGOEXISTE.success) {
        // Si el código ya existe, llamar recursivamente a la función para generar un nuevo código
       return generarCodigo();
    } else {
        // Si el código es único, devolverlo
        return CODIGO;
    }
}

export function generarIteraciones(FECHA_INICIAL, FECHA_FINAL,ID_ENTREGA) {
    const DIAS_PROYECTO = FECHA_FINAL.diff(FECHA_INICIAL, 'days') + 1;
    const PARTES = Math.floor(DIAS_PROYECTO / 7);
    const DIAS_RESTANTES = DIAS_PROYECTO % 7;
    const ARRAYPARTES = Array(PARTES).fill(7);
    let success = false;

    for (let i = 0; i < DIAS_RESTANTES; i++) {
        ARRAYPARTES[i]++;
    }
    
    let INICIOPARTE = FECHA_INICIAL.clone();
    const FECHAS = [];

    for(let i = 0; i < PARTES; i++){
        let FINPARTE = INICIOPARTE.clone().add(ARRAYPARTES[i] - 1, 'days'); 
        //if (i < DIAS_RESTANTES){
        //    FINPARTE.add(1, 'day'); 
        //}
        FECHAS.push({ 
            INICIO: INICIOPARTE.format('YYYY-MM-DD'), 
            FIN: FINPARTE.format('YYYY-MM-DD') 
        });
        INICIOPARTE = FINPARTE.clone().add(1, 'day');  
    }
    for(let i=0; i<FECHAS.length;i++){
        //let FIN = moment(ARREGLOPROYECTO[i].FIN).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        success = registrarIteracion("", "En espera", FECHAS[i].INICIO, FECHAS[i].FIN, ID_ENTREGA);
    }
    return success;
}


