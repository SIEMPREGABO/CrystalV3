import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/auth.js';
import { useAuth } from '../context/authContext.js';
import Header from './Header.jsx';
import { useEffect } from 'react';
import styles from '../css/login.module.css';
import Footer from "./Footer.jsx";

export const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema)
    });
    const navigate = useNavigate();
    const { signin, IsAuthenticated, autherrors, message, setAutherrors, setMessage } = useAuth();



    const onSubmit = handleSubmit(async (values) => {
        signin(values);
    })

    useEffect(() => {
        setMessage([]);
        setAutherrors([]);
        if (IsAuthenticated) navigate("/panel");
    }, [IsAuthenticated]);



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
            <div className={styles.login}>

                <div className={styles.container} id='main'>


                    <div className={styles['sign-in']}>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.forml}>
                            <h1 className={styles.h1l}>Ingresar</h1>

                            <input className={styles.inputl}
                                type="email"
                                name="CORREO"
                                placeholder="E-Mail"
                                {...register("CORREO", { required: true, message: "campo requerido" })} />

                            {errors.CORREO &&
                                <div className=" pe-2 m-1">
                                    <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                        {errors.CORREO.message}
                                    </div>
                                </div>
                            }


                            <input className={styles.inputl}
                                type="password"
                                name="CONTRASENIA"
                                placeholder="Contraseña"
                                {...register("CONTRASENIA", { required: true, message: "campo requerido" })} />

                            {errors.CONTRASENIA &&

                                <div className=" pe-2 m-1">
                                    <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                        {errors.CONTRASENIA.message}
                                    </div>
                                </div>
                            }
                            <Link to="/reset"><a href="#">Olvidaste tu contraseña?</a></Link>
                            <button type='submit' className={styles.buttonl}>Iniciar Sesión!</button>
                        </form>
                    </div>
                    <div className={styles['overlay-container']}>
                        <div className={styles.overlay}>
                            <div className={styles['overlay-right']}>
                                <h1 className={styles.h1l}>Nuevo en CLEAR?</h1>
                                <p>Ingresa tus datos y registrate con nosotros</p>
                                <Link to="/register"><button className={styles.buttonl} id={styles.signUp}>Registrarse</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;

