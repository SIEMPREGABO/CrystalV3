import { registerSchema } from "../schemas/auth";
import { useAuth } from '../context/authContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../css/register.module.css"
import Header from './Header.jsx';
import Footer from "./Footer.jsx"

export const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const { signup, IsAuthenticated, autherrors, setAutherrors, isRegister, message } = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (values) => {
        await signup(values);
        reset();
    })

    useEffect(() => {
        if(isRegister) navigate("/login");
        if (IsAuthenticated ) navigate("/panel");
    }, [IsAuthenticated,isRegister]);


    return (
        <div>
            <Header />
            {message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                <p class="text-lg font-semibold m-2">{message}</p>
            </div>
            }
            {autherrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                <p class="text-lg font-semibold m-2">{autherrors}</p>
            </div>
            }
            {errors.refine && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                {errors.refine.message}
            </div>
            }

            <div className={styles.register}>
                <div className={styles.containerr} id='main'>
                    <div className={styles['overlay-containerr']}>
                        <div className={styles.overlayr}>
                            <div className={styles['overlay-rightr']}>
                                <h1 className={styles.h1r}>¿Ya tienes una cuenta?</h1>
                                <p>Inicia Sesión para volver al trabajo </p>
                                <Link to="/login"><button className={styles.buttonr} id={styles.signInr}>Iniciar Sesión</button></Link>
                            </div>
                        </div>

                    </div>
                    <div className={styles['sign-inr']}>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.formr}>
                            <h1 className={styles.h1r}>Crear Cuenta</h1>
                            <div className={styles.inputgroup}>
                                <input className={styles.inputr}
                                    type="text"
                                    name="NOMBRE_PILA"
                                    placeholder="Nombre (s)"
                                    {...register("NOMBRE_PILA", { required: true })} />
                                    <label>Nombre (s)<span style={{color: "red"}}>*</span></label>
                                {errors.NOMBRE_PILA &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.NOMBRE_PILA.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}>
                                <input className={styles.inputr}
                                    type="text"
                                    name="APELLIDO_PATERNO"
                                    placeholder="Apellido Paterno"
                                    {...register("APELLIDO_PATERNO", { required: true })} />
                                    <label>Apellido Paterno<span style={{color: "red"}}>*</span></label>
                                {errors.APELLIDO_PATERNO &&
                                    <div className=" pe-2 m-1">
                                    <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                        {errors.APELLIDO_PATERNO.message}
                                    </div>
                                </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="text"
                                name="APELLIDO_MATERNO"
                                placeholder="Apellido Materno"
                                {...register("APELLIDO_MATERNO", { required: true })} />
                                <label>Apellido Materno<span style={{color: "red"}}>*</span></label>
                                {errors.APELLIDO_MATERNO &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.APELLIDO_MATERNO.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="text"
                                name="NUMERO_BOLETA"
                                placeholder="Número de Boleta"
                                {...register("NUMERO_BOLETA", { required: true })} />
                                <label>Número de Boleta<span style={{color: "red"}}>*</span></label>
                                {errors.NUMERO_BOLETA &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.NUMERO_BOLETA.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="text"
                                name="NOMBRE_USUARIO"
                                placeholder="Nombre de Usuario"
                                {...register("NOMBRE_USUARIO", { required: true })} />
                                <label>Nombre de Usuario<span style={{color: "red"}}>*</span></label>
                                {errors.NOMBRE_USUARIO &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.NOMBRE_USUARIO.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="text"
                                name="TELEFONO"
                                maxLength="12"
                                placeholder="Teléfono"
                                {...register("TELEFONO", { required: true })} />
                                <label>Teléfono <span style={{color: "red"}}>*</span></label>
                                {errors.TELEFONO &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.TELEFONO.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="email"
                                name="CORREO"
                                placeholder="Correo Electrónico"
                                {...register("CORREO", { required: true })} />
                                <label>Correo Electrónico <span style={{color: "red"}}>*</span></label>
                                {errors.CORREO &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.CORREO.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="email"
                                name="repeatCORREO"
                                placeholder="Confirmar Correo"
                                {...register("repeatCORREO", { required: true })} />
                                <label>Confirmar Correo Electrónico <span style={{color: "red"}}>*</span></label>
                                {errors.repeatCORREO &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.repeatCORREO.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="password"
                                name="CONTRASENIA"
                                placeholder="Contraseña"
                                {...register("CONTRASENIA", { required: true })} />
                                <label>Contraseña <span style={{color: "red"}}>*</span></label>
                                {errors.CONTRASENIA &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.CONTRASENIA.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={styles.inputgroup}><input className={styles.inputr}
                                type="password"
                                name="repeatCONTRASENIA"
                                placeholder="Confirmar Contraseña"
                                {...register("repeatCONTRASENIA", { required: true })} />
                                <label>Confirmar Contraseña <span style={{color: "red"}}>*</span></label>
                                {errors.repeatCONTRASENIA &&
                                    <div className=" pe-2 m-1">
                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.repeatCONTRASENIA.message}
                                        </div>
                                    </div>
                                }
                            </div>
                            <button className={styles.buttonr} type="submit">Registrarse!</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Register;