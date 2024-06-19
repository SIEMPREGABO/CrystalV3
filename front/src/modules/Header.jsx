import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../css/header.css';
import logo from '../images/logoClear-c.png';
import { useProject } from '../context/projectContext';
import { useStateContext } from '../context/Provider';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import NotificacionHeader from '../components/NotificacionHeader';
import React, { useEffect, useState } from 'react'
import { RiNotification3Line } from 'react-icons/ri';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <TooltipComponent content={title} position='BottomCenter'>
        <button type='button' onClick={customFunc} style={{ color }} className='relative text-xl rounded-full p-3 hover:bg-light-gray'>
            <span style={{ background: dotColor }} className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2' />
            {icon}
        </button>
    </TooltipComponent>
)

export const Header = () => {

    const { IsAuthenticated, logout, notificaciones } = useAuth();
    const { activeMenu, setActiveMenu, isClicked, setIsClicked, handleClick, screenSize, setScreenSize, currentColor } = useStateContext();

    const [contadorNotificaciones, setContadorNotificaciones] = useState(0);


    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);

        window.addEventListener('resize', handleResize);
        handleResize();
        setIsClicked(false);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (screenSize <= 900) {
            setActiveMenu(false);
        } else {
            setActiveMenu(true);
        }
    }, [screenSize]);

    useEffect(() => {
        let contador = 0;
        notificaciones?.map((notificacion) => {
            if (notificacion.ESTADO_VISUALIZACION === 0) {
                contador++;
            }
            setContadorNotificaciones(contador);
        })
    }, [notificaciones]);


    const handleNotificacionClick = () => {
        handleClick("notificacion");
        setContadorNotificaciones(0); // Reinicia el contador de notificaciones a cero
    };

    const handleActiveMenu = () => setActiveMenu(!activeMenu);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-info bg-opacity-25 sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" style={{ width: 300 + "px" }}><img src={logo} style={{ height: 75 + "px", marginLeft: 50 + "px", display: 'inline-block' }} alt="LogoCrystalClear" /><h1 className='titulo' style={{ display: 'inline-block', color: '#000' }}>C L E A R</h1></Link>
                    {IsAuthenticated ? (
                       <ul className="navbar-nav mb-1 mb-lg-0">
                       <li className="nav-item i-lista-i1"><Link className="nav-link border-secondary" style={{ borderBottomWidth: "3px" }} to="/panel">Panel</Link></li>
                       <li className=""><NavButton title="Notificaciones" customFunc={() => handleClick("notificacion")} color='black' icon={<RiNotification3Line />} /></li>
                       {/*contadorNotificaciones > 0 ? <div className="text-white text-xs rounded-full mt-3 mb-3  p-1 px-2 bg-orange-500 "> {contadorNotificaciones}</div> : []*/}
                       <li className="nav-item i-lista-i1"><Link className="nav-link border-secondary " style={{ borderBottomWidth: "3px" }} to="/configurar-perfil">Configuración</Link></li>
                       <li className="nav-item i-lista-i2"><Link className="nav-link border-secondary" style={{ borderBottomWidth: "3px" }} to="/" onClick={() => {
                           logout();
                       }}>Cerrar Sesión</Link></li>
                   </ul>
               ) : (<> <ul className="navbar-nav mb-2 mb-lg-0">
                   <li className="nav-item i-lista-i1"><Link className="nav-link border-3 border-secondary rounded-pill" to="/login">Iniciar Sesión</Link></li>
                   <li className="nav-item i-lista-i2"><Link className="nav-link border-3 border-secondary rounded-pill" to="/register">Registrarse</Link></li>
               </ul></>)} 
                </div>
                {isClicked.notificacion && <NotificacionHeader />}
            </nav >
            <Outlet />
        </div >
    );
}
export default Header;