import { useForm } from 'react-hook-form'
import { resetSchema } from '../schemas/auth.js';
import { useAuth } from '../context/authContext.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react';
import Header from './Header.jsx';
import Footer from "./Footer.jsx"

export const Reset = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetSchema)
    });


    const { resetToken, setMessage, setAutherrors, autherrors, message } = useAuth();

    const onSubmit = handleSubmit(async (values) => {
        resetToken(values);
    });

    useEffect(() => {
        setMessage([]);
        setAutherrors([]);
    }, []);


    return (
        <div>
            <Header />
            <section className="bg-gray-50 dark:bg-gray-900">
                {message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                    <p class="text-lg font-semibold m-2">{message}</p>
                </div>
                }
                {autherrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                    <p class="text-lg font-semibold m-2">{autherrors}</p>
                </div>
                }
                <div className="flex flex-col items-center justify-center px-6 py-2 xl:h-screen mx-auto">
                    
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                        <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            ¿Olvidaste tu contraseña?
                        </h1>
                        <p className="font-light text-gray-500 dark:text-gray-400">¡No te preocupes! ¡Simplemente ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña!</p>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Introduce tu correo electronico</label>
                                <input type="email" name="CORREO" placeholder='alguien@example.com' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  {...register("CORREO", { required: true, message: "Campo requerido" })} />
                                {errors.CORREO &&
                                    <div className=" col-7 pe-2 mt-3">

                                        <div className=" flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">
                                            {errors.CORREO.message}
                                        </div>

                                    </div>
                                }
                                
                            </div>

                            <button type="submit" value="enviar" className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">Recuperar contraseña</button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Reset;

