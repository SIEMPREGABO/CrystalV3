import { io } from "socket.io-client";
import { useEffect, useState, useRef } from 'react';
import { useProject } from '../context/projectContext';
import { useAuth } from '../context/authContext';
import { useForm } from 'react-hook-form';

export const ChatIteracion = () => {
  const messageInputRef = useRef(null);
  //const socket = io('http://localhost:4001');
  const { user } = useAuth();
  const { createMessages, iteracionactual, messagesChat, getMessages } = useProject();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connectedsocket, setConnectedSocket] = useState(null);
  const [room, setRoom] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /*useEffect(() => {
    const iteracion = {
      ID_ITERACION: 1
    }
    getMessages(iteracion);
  }, []);*/

  useEffect(() => {
    if (messagesChat != null) {
      const newMessages = messagesChat.map((msg) => ({
        data: msg.CONTENIDO,
        from: (user.ID === msg.ID_USUARIO_ENVIA ? 'Me' : msg.NOMBRE_USUARIO),
      }));
      setMessages(newMessages);
    }
  }, [messagesChat]);

  const onSubmit = handleSubmit(async (values) => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const día = String(fecha.getDate()).padStart(2, '0');
    const fechaFormateada = `${año}-${mes}-${día}`;
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    const horaFormateada = `${horas}:${minutos}:${segundos}`;

    const data = {
      CONTENIDO: values.CONTENIDO,
      FECHA: fechaFormateada,
      HORA: horaFormateada,
      USUARIO: user.ID,
      ITERACION: iteracionactual.ID
      //ITERACION: iteracionactual,
    };

    createMessages(data);
    const newMessage = {
      data: values.CONTENIDO,
      from: user.NOMBRE_USUARIO,
      room: room
    };
    const localMessage = {
      data: values.CONTENIDO,
      from: 'Me',
      room: room
    }
    setMessages([...messages, localMessage]);
    connectedsocket.emit('message', newMessage);
    const messageInput = document.getElementById("messageInput");
    if (messageInput) {
      messageInput.value = "";
    }
  });

  useEffect(() => {
    const iteracion = {
      ID_ITERACION: iteracionactual.ID
    }
    getMessages(iteracion);
  
    const socket = io('http://localhost:4001', {
      auth: {
        sala: "3",
      }
    });
    setConnectedSocket(socket);
  
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on('message', receiveMessage);
  
    return () => {
      socket.off('message', receiveMessage);
    }
  }, []);

  const receiveMessage = message => {
    const newMessage = {
      data: String(message.data.data),
      from: String(user.NOMBRE_USUARIO === message.data.from ? 'Me' : message.data.from),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]); // Solo agregamos el contenido del mensaje
  };

  return (
    <div className="h-screen bg-white text-black flex items-center justify-center">
      <div className='w-2/4 h-3/4 border-2 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold my-2 underline text-center mb-4 text-5xl text-blue-700'>Chat De Iteración</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-100 p-10 w-full h-full rounded-lg overflow-y-scroll" action="POST">
        <div className='sticky'>
        <ul>
            {messages.map((message, i) => (
              <li key={i} className={`my-2 p-2 table text-sm rounded-sm w-fit ${message.from === 'Me' ? 'bg-pink-400 ml-auto text-black' : 'bg-indigo-300 mr-auto'}`}>
                <b className='text-xs text-white-500'>{message.from}</b>: {message.data}
              </li>
            ))}
          </ul>
        </div>
          <div className='d-flex gap-4 sticky'>
            <input type="text" placeholder='Escribe un mensaje'
              className="block w-5/6 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              id="messageInput"
              onChange={(e) => setMessage(e.target.value)}
              {...register("CONTENIDO", { required: true, message: "Campo Requerido" })} />

            <div className='d-flex'>
              <button type="submit" className="btn btn-primary d-flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"></path>
                </svg>
                Enviar
              </button>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}

export default ChatIteracion;