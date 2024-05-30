import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestLogin, requestRegister, requestLogout, requestVerify, requestReset, requestPass, requestUpdate } from "../requests/auth.js";
import Cookies from "js-cookie";
import { useProject } from "./projectContext.js";
import {requestProjects} from "../requests/projectReq.js";

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
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  };

  const signup = async (user) => {
    try {
      const res = await requestRegister(user);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  const resetToken = async (user) => {
    try {
      const res = await requestReset(user);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  const resetPass = async (user) => {
    try {
      const res = await requestPass(user);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
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
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  const updateUser = async (user) => {
    try {
      console.log(user);
      const res = await requestUpdate(user);
      setUser(res.data);
      setMessage("Informacion Actualizada");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
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

        IsAuthenticated, isLoading,

        setAutherrors, setMessage, setUser, setIsAuthenticated, setLoading,setProjects,

        signin,
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