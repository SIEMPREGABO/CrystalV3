import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../css/header.css';
import logo from '../images/logoClear-c.png';


export const Header = () => {

    const { IsAuthenticated, logout } = useAuth();

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-info bg-opacity-25 sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" style={{ width: 300 + "px" }}><img src={logo} style={{ height: 75 + "px", marginLeft: 50 + "px", display: 'inline-block' }} alt="LogoCrystalClear" /><h1 className='titulo' style={{ display: 'inline-block', color: '#000' }}>C L E A R</h1></Link>
                    {IsAuthenticated ? (
                        <>
                            <ul className="navbar-nav mb-2 mb-lg-0">
                                <li className="nav-item i-lista-i1"><Link className="nav-link border-secondary" style={{ borderBottomWidth: "3px" }} to="/panel">Panel</Link></li>
                                <li className="nav-item i-lista-i1"><Link className="nav-link border-secondary " style={{ borderBottomWidth: "3px" }} to="/configurar-perfil">Configuración</Link></li>
                                <li className="nav-item i-lista-i2"><Link className="nav-link border-secondary" style={{ borderBottomWidth: "3px" }} to="/" onClick={() => {
                                    logout();
                                }}>Cerrar Sesión</Link></li>
                            </ul>
                        </>) : (<> <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item i-lista-i1"><Link className="nav-link border-3 border-secondary rounded-pill" to="/login">Iniciar Sesión</Link></li>
                            <li className="nav-item i-lista-i2"><Link className="nav-link border-3 border-secondary rounded-pill" to="/register">Registrarse</Link></li>
                        </ul></>)}
                </div>
            </nav >
            <Outlet />
        </div >
    );
}
export default Header;