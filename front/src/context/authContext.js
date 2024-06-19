import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestLogin, requestRegister, requestLogout, requestVerify, requestReset, requestPass, requestUpdate, requestCambiarEstado  } from "../requests/auth.js";
import Cookies from "js-cookie";
import {requestProjects} from "../requests/projectReq.js";
import swal from 'sweetalert';


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 

  const [projects, setProjects] = useState([]);

  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  const [autherrors, setAutherrors] = useState([]);

  const [message, setMessage] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (autherrors.length > 0) {
      const timer = setTimeout(() => {
        setAutherrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (message.length > 0) {
      const timer = setTimeout(() => {
        setMessage([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autherrors, message]);

  const getProjects = async () => {
    try {
      const res = await requestProjects();
      setProjects(res.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  };

  const signin = async (user) => {
    try {
      const res = await requestLogin(user);
      setUser(res.data);
      setNotificaciones(res.data.notificaciones);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Iniciar sesión',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Iniciar sesión',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  };
  const changeState = async (notificaciones) =>{
    try {
      const res = await requestCambiarEstado(notificaciones);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        swal({
          title: 'Cambio de estado notificacion',
          text: error.response.data.message,
          icon: 'error',
          button: 'Aceptar',
        });
      } else {
        swal({
          title: 'Cambio de estado notificacion',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const signup = async (user) => {
    try {
      const res = await requestRegister(user);
      //setMessage(res.data.message);
      swal({
        title: 'Registrar Usuario',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Registrar Usuario',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Registrar Usuario',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const resetToken = async (user) => {
    try {
      const res = await requestReset(user);
      //setMessage(res.data.message);
      swal({
        title: 'Restablecer contraseña',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Restablecer contraseña',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Restablecer contraseña',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const resetPass = async (user) => {
    try {
      const res = await requestPass(user);
      //setMessage(res.data.message);
      swal({
        title: 'Restablecer contraseña',
        text: res.data.message,
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Restablecer contraseña',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Restablecer contraseña',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const logout = async () => {
    try {
      await requestLogout();
      setIsAuthenticated(false);
      setUser(null);
      setProjects([]);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Cerrar sesión',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Cerrar sesión',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  const updateUser = async (user) => {
    try {
      console.log(user);
      const res = await requestUpdate(user);
      setUser(res.data);
      //setMessage("Informacion Actualizada");
      swal({
        title: 'Actualizar usuario',
        text: 'Informacion Actualizada',
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        //setProjecterrors(error.response.data.message);
        swal({
          title: 'Actualizar usuario',
          text: error.response.data.message,
          icon: 'warning',
          button: 'Aceptar',
        });
      } else {
        //setProjecterrors("Error del servidor");
        swal({
          title: 'Actualizar usuario',
          text: 'Error del servidor',
          icon: 'error',
          button: 'Aceptar',
        });
      }
    }
  }

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await requestVerify(cookies.token);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,projects,

        autherrors, message,

        IsAuthenticated, isLoading,notificaciones,setNotificaciones,

        setAutherrors, setMessage, setUser, setIsAuthenticated, setLoading,setProjects,

        signin,changeState,
        signup,
        resetToken,
        resetPass,
        updateUser,
        logout,getProjects
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;