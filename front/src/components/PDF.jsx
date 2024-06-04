import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import escom from '../images/ESCOM.png';
import ipn from '../images/IPN.png';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px'
    },
    instheader: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    page: {
        padding: '15px',
        marginTop: '15px',
        marginBottom: '15px',
    },
    logos: {
        width: '100px',
        height: '100px'
    },
    title: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'Times-Roman',
        textAlign: 'center'
    },
    projectDesc: {
        border: '1pt solid black',
    },
    projectProps: {
        border: '0.5pt solid black',
        fontSize: '12px',
        width: '100%',
        flexDirection: 'row',
        paddingLeft: '5px'
    },
    columns: {
        flex: 1,
        flexShrink: 1,
        flexGrow: 1,
        borderRight: '0.5pt solid black',
    },
    midcolumns: {
        flex: 1,
        flexShrink: 1,
        flexGrow: 1,
        borderRight: '0.5pt solid black',
        paddingLeft: '5px'
    },
    lastcolumns: {
        flex: 1,
        flexShrink: 1,
        flexGrow: 1,
        paddingLeft: '5px'
    },
    taskscontent: {
        margin: '15px',
        width: '100%',
        borderBottom: '0.5pt solid black'
    },
    etitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Times-Roman',
    },
    econtent: {
        margin: '5px',
        width: '100%',
        borderBottom: '0.5pt solid black'
    },
    ititle: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'Times-Roman',
    },
    icontent: {
        margin: '5px',
        width: '100%',
        flexDirection: 'row'
    },
    tfcolumn: {
        flex: 1,
        flexShrink: 1,
        flexGrow: 1,
        borderBottom: '0.25pt solid black',
        borderRight: '0.25pt solid black'
    },
    tindex: {
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'Times-Roman',
        textAlign: 'center'
    },
    tmcolumn: {
        flex: 1,
        flexShrink: 1,
        flexGrow: 4,
        borderBottom: '0.25pt solid black',
        borderRight: '0.25pt solid black'
    },
    tname: {
        fontSize: '12px',
        fontFamily: 'Times-Roman',
        padding: '5px'
    },
    tlcolumn: {
        fontSize: '12px',
        fontFamily: 'Times-Roman',
        flex: 1,
        flexShrink: 1,
        flexGrow: 2,
        borderBottom: '0.25pt solid black',
    },
    testdes: {
        fontSize: '12px',
        fontFamily: 'Times-Roman',
        padding: '5px'
    }
});

const PDF = ({ project, descproject, participants, fcreate, finicio, ftermino, eterm, iterm, taskterm, taskData }) => {
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <Image style={styles.logos} src={ipn}></Image>
                    <View style={styles.instheader}>
                        <Text style={styles.title}>INSTITUTO POLITÉCNICO NACIONAL</Text>
                        <Text>ESCUELA SUPERIOR DE CÓMPUTO</Text>
                    </View>
                    <Image style={styles.logos} src={escom}></Image>
                </View>

                <View style={styles.projectDesc}>
                    <Text style={styles.projectProps}>Proyecto: {project}</Text>
                    <Text style={styles.projectProps}>Descripcion: {descproject}</Text>
                    <Text style={styles.projectProps}>Particpantes: {participants}</Text>
                    <View style={styles.projectProps}>
                        <Text style={styles.columns}>Fecha de Creacion: {fcreate}</Text>
                        <Text style={styles.midcolumns}>Fecha de Inicio: {finicio}</Text>
                        <Text style={styles.lastcolumns}>Fecha de Termino: {ftermino}</Text>
                    </View>
                    <View style={styles.projectProps}>
                        <Text style={styles.columns}>Entregas Terminadas: {eterm}</Text>
                        <Text style={styles.midcolumns}>Iteraciones Terminadas: {iterm}</Text>
                        <Text style={styles.lastcolumns}>Tareas Terminadas: {taskterm}</Text>
                    </View>
                </View>

                <View style={styles.taskscontent}>
                    {taskData && taskData.map((entrega, index) => (
                        <View key={index}>
                            <Text style={styles.etitle}>Entrega N° {index + 1}.</Text>
                            {entrega.ITERACIONES && entrega.ITERACIONES.length > 0 ? (
                                JSON.parse(entrega.ITERACIONES).map((iteracion, indexi) => (
                                    <View key={indexi} style={styles.econtent}>
                                        <Text style={styles.ititle}>Iteración N° {indexi + 1}</Text>
                                        {iteracion.tareas && iteracion.tareas.length > 0 ? (
                                            iteracion.tareas.map((tarea, indexj) => (
                                                <View key={indexj} style={styles.icontent}>
                                                    <View style={styles.tfcolumn}><Text style={styles.tindex}>{indexj + 1}</Text></View>
                                                    <View style={styles.tmcolumn}><Text style={styles.tname}>{tarea.nombre}</Text></View>
                                                    <View style={styles.tlcolumn}><Text style={styles.testdes}>{tarea.est_desarr}</Text></View>
                                                </View>
                                            ))
                                        ) : (
                                            <View style={styles.icontent}>
                                                <View style={styles.tfcolumn}><Text style={styles.tname}>No se han desarrollado tareas en esta iteración</Text></View>
                                            </View>
                                        )}
                                    </View>
                                ))
                            ) : (
                                <Text>No hay iteraciones para esta entrega.</Text>
                            )}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    )
}

export default PDF;