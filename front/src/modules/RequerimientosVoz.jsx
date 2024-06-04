import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import DoneIcon from '@mui/icons-material/Done';
import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { RestoreFromTrash } from '@mui/icons-material';
import { } from '@mui/material/styles';
import { create } from '@mui/material/styles/createTransitions';
import { useForm } from 'react-hook-form';
import { useProject } from "../context/projectContext.js";
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '../css/voicereq.module.css';
import { requerimientoxVozSchema } from '../schemas/project.js';



function createRequirement(tipo, requerimiento) {
    return { tipo, requerimiento };
}

export const RequerimientoVoz = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(requerimientoxVozSchema)
    });

    const { createRequirements, projecterrors, entregaactual, message } = useProject();

    const onSubmit = handleSubmit(async (values) => {
        const data = {
            OBJETIVO: values.REQUERIMIENTO,
            DESCRIPCION: values.REQUERIMIENTO,
            TIPO: type,
            ID_ENTREGA: entregaactual.ID
        };
        createRequirements(data);
    });

    const [type, setType] = useState('');
    const [messagev, setMessagev] = useState('');
    const [rows, setRows] = useState([]);
    const commands = [
        {
            command: "levantar requerimiento *",
            callback: (requerimiento) => {
                setMessagev(`El requerimiento es: ${requerimiento}`);
                setType('Requerimiento');
                //rows.push(createRequirement('Requerimiento', requerimiento));
            }
        },
        {
            command: "cambio *",
            callback: (cambio) => {
                setMessagev(`El cambio solicitado es: ${cambio}`);
                setType('Cambio');
                //rows.push(createRequirement('Cambio', cambio));
            }
        }
    ];

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({
        commands
    });

    const addRequirement = () => {
        setRows([...rows, createRequirement(type, transcript)]);
        console.log(rows
        );
    }

    const startListening = () => {
        resetTranscript();
        setMessagev();
        SpeechRecognition.startListening({
            continuous: false,
            language: 'es-MX'
        });
    }

    const stopListening = () => {
        SpeechRecognition.stopListening();
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser don't support speech recoginition.</span>
    }

    const Icon = listening ? MicIcon : MicOffIcon;


    return (
        <div className={styles.App}>
            <header className={styles['App-header']}>
                <div className={styles.container}>
                    <h1 className={styles.titulo}>Requerimientos X Voz</h1>
                    <p className={styles.parrafo}>Para levantar requerimientos con respecto a una entrega, solo pulsa el
                        botón en forma de micrófono que se encuentra justo debajo y comienza a hablar!</p>
                    <p className={styles.parrafo}><em>Nota: Para solicitar un nuevo requerimiento di "levantar requerimiento (tu requerimiento)", en caso de que desees solictar un cambio dí lo siguiente "cambio de (tu cambio)"</em></p>
                    <form className={styles.formulario} onSubmit={handleSubmit(onSubmit)}>
                        <IconButton color='primary' size='large' onMouseUp={startListening} onMouseDown={stopListening}>
                            <Icon fontSize='large' />
                        </IconButton>
                        <TextField
                            className={styles.message}
                            color='warning'
                            id="standard-multiline-flexible"
                            label="Requerimiento / cambio "
                            multiline
                            maxRows={4}
                            variant="standard"
                            placeholder='Aquí se mostrar la transcripción del requerimiento / o cambio solicitado'
                            value={transcript}
                            name="REQUERIMIENTO"
                            {...register("REQUERIMIENTO", { required: true, message: "Campo requerido" })}
                        />
                        <IconButton type="submit" color="primary" size="large" onMouseUp={addRequirement}>
                            <DoneIcon fontSize='large'>
                            </DoneIcon>
                        </IconButton>
                        {errors.REQUERIMIENTO &&
                            <div className="p-2">
                                <div className=" bg-danger mt-2 text-white shadow ">{errors.REQUERIMIENTO.message}</div>
                            </div>
                        }
                    </form>
                    <p>{transcript}</p>
                    <p>{messagev}</p>
                    <p>{type}</p>
                    <TableContainer component={Paper} >
                        <Table sx={{ minWidth: 400 }} aria-label="simple table">
                            <TableHead sx={{ bgcolor: "blue" }}>
                                <TableRow>
                                    <TableCell>N°</TableCell>
                                    <TableCell>Tipo Requerimiento</TableCell>
                                    <TableCell>Requerimiento</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    rows.map((row) => (
                                        <TableRow key={row.requerimiento} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>{1}</TableCell>
                                            <TableCell>{row.tipo}</TableCell>
                                            <TableCell>{row.requerimiento}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </header>
        </div>
    );
}

export default RequerimientoVoz;