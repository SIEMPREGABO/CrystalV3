import { io } from "socket.io-client";
import { useEffect, useState, useRef } from 'react';
import { useProject } from '../context/projectContext';
import { useAuth } from '../context/authContext';
import { useForm } from 'react-hook-form';
import { Header } from '../components';
import { useStateContext } from '../context/Provider.js';

export const ChatIteracion = () => {
  const messageInputRef = useRef(null);
  const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();
  const { user } = useAuth();
  const { createMessages, iteracionactual, entregaactual, messagesChat, messagesChat2, getMessages,getMessages2, fechasproject,iterationParticipants, iteraciones, entregas, participants, chats, getChatsiteracionesDisponibles } = useProject();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messages2, setMessages2] = useState([]);
  const [connectedsocket, setConnectedSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [participantColors, setParticipantColors] = useState({});
  const [entregaActiva, setEntregaActiva] = useState("");
  const [iteracionActiva, setIteracionActiva] = useState("");
  const [connectedUserList, setConnectedUserList] = useState([]);

  const downloadChat = () => {
    const element = document.createElement("a");
    const file = new Blob([messages.map(msg => `${msg.from}: ${msg.data}`).join("\n")], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "chat.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadChat2 = () => {
    const element = document.createElement("a");
    const file = new Blob([messages2.map(msg => `${msg.from}: ${msg.data}`).join("\n")], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "chat.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (messagesChat != null) {
      const newMessages = messagesChat.map((msg) => ({
        data: msg.CONTENIDO,
        from: (user.ID === msg.ID_USUARIO_ENVIA ? 'Yo' : msg.NOMBRE_USUARIO),
      }));
      setMessages(newMessages);
    }
  }, [messagesChat]);

  useEffect(() => {
    if (messagesChat2 != null) {
      const newMessages = messagesChat2.map((msg) => ({
        data: msg.CONTENIDO,
        from: (user.ID === msg.ID_USUARIO_ENVIA ? 'Yo' : msg.NOMBRE_USUARIO),
      }));
      setMessages2(newMessages);
    }
  }, [messagesChat2]);

  useEffect(() => {
    if (iteraciones != null) {
      const found = entregas.find(entrega => entrega.ID === entregaactual.ID);
      const found2 = iteraciones.find(iteracion => iteracion.ID === iteracionactual.ID);
      setEntregaActiva(found.Nombre_Entrega);
      setIteracionActiva(found2.Nombre_Iteracion);
    }
  }, [entregas, iteraciones]);

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
    };

    createMessages(data);
    const newMessage = {
      data: values.CONTENIDO,
      from: user.NOMBRE_USUARIO,
      room: room
    };
    const localMessage = {
      data: values.CONTENIDO,
      from: 'Yo',
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
    console.log(iteracionactual);
    const proyecto = {
      ID_PROYECTO: fechasproject[0].ID,
    }

    //getChatsiteracionesDisponibles(proyecto)
    const iteracion = {
      ID_ITERACION: iteracionactual.ID
    }
    getMessages(iteracion);

    if (iterationParticipants != null) {
      console.log(iterationParticipants);
    } else {
      console.log("Sin participantes");
    }

    // Crear el socket cuando el componente se monta
    const socket = io('http://localhost:4001', {
      auth: {
        sala: iteracionactual.ID,
        iduser: user.NOMBRE_USUARIO,
      }
    });
    setConnectedSocket(socket);

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on('updateUserList', (userList) => {
      console.log('Connected users in my room:', userList);
      setConnectedUserList(userList);
    });

    socket.on('message', receiveMessage);

    // Generate and store colors for participants
    const colors = {};
    iterationParticipants?.forEach(participant => {
      const color = getRandomRGB();
      const { r, g, b } = extractRGB(color);
      const luminance = getLuminanceRGB(r, g, b);
      const textColor = getTextColor(luminance);
      colors[participant.ID_USUARIO] = { color, textColor };
    });
    setParticipantColors(colors);

    console.log("chats");
    console.log(chats);

    // Desconectar el socket cuando el componente se desmonta
    return () => {
      socket.off('message', receiveMessage);
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, []);

  const receiveMessage = message => {
    const newMessage = {
      data: String(message.data.data),
      from: String(user.NOMBRE_USUARIO === message.data.from ? 'Yo' : message.data.from),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const getRandomRGB = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const getLuminanceRGB = (r, g, b) => {
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;
    const luminance = 0.2126 * normalizedR + 0.7152 * normalizedG + 0.0722 * normalizedB;
    return luminance;
  }

  const extractRGB = (color) => {
    const rgb = color.match(/\d+/g).map(Number);
    return { r: rgb[0], g: rgb[1], b: rgb[2] };
  }

  const getTextColor = (luminance) => {
    return luminance > 0.5 ? 'black' : 'white';
  }

  const handleChatClick = (chatID) => {
    const selectedChatid = chatID;
    
    const iteracion = {
      ID_ITERACION: selectedChatid
    }
    getMessages2(iteracion);
    console.log("mensajes a descargar");
    console.log(messages2);
    downloadChat2();
    console.log("ID de la iteración seleccionada:", selectedChatid);
  }

  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl h-5/6'>
      <Header category="Page" title="Chat de Iteracion" />
      <div className="w-full flex ">
        <div className="w-4/12 p-2 border-r-4 border-black border-solid border-opacity-25">
          <h2 className="text-xl font-medium border-b-4 mb-4">Iteración Activa </h2>
          <p className="text-lg text-">{iteracionActiva ? iteracionActiva : "Cargando Iteracion Activa"} {" de "} {entregaActiva ? entregaActiva : "Cargando Entrega Activa"}: {iteracionactual.FECHA_INICIO ? new Date(iteracionactual.FECHA_INICIO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"} - {iteracionactual.FECHA_TERMINO ? new Date(iteracionactual.FECHA_TERMINO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "Cargando"}</p>
          <h2 className="text-xl font-medium border-b-4 mb-4">Participantes de Iteración</h2>
          {iterationParticipants != null && iterationParticipants.length > 0 ? (
            iterationParticipants.map((participant, index) => {
              const { color, textColor } = participantColors[participant.ID_USUARIO] || { color: 'grey', textColor: 'black' };
              return (
                <div className="px-4" key={index}>
                  <div className="flex items-center my-2 border-b border-solid border-black border-opacity-20">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color, color: textColor }}
                    >
                      {participant.NOMBRE_USUARIO.charAt(0)}
                    </div>
                    <div className="ml-2">
                      <p className="text-lg font-medium">{participant.NOMBRE_USUARIO} {connectedUserList.find(user => user.userId === participant.NOMBRE_USUARIO) ? (<span className="text-sm font-light">{"(Conectado)"}</span>) : (<span className="text-sm font-light">{"(Desconectado)"}</span>)}</p>
                      <p className="italic">{participant.NOMBRE}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xl font-medium italic">Sin participantes con desarrollando tareas</p>
          )}
          <h2 className="text-xl font-medium border-b-4 mb-4">Participantes Sin Tareas en Iteración</h2>
          {participants != null && (participants.filter(item => !iterationParticipants.some(item2 => item2.NOMBRE_USUARIO === item.NOMBRE_USUARIO))).length > 0 ? (
            (participants.filter(item => !iterationParticipants.some(item2 => item2.NOMBRE_USUARIO === item.NOMBRE_USUARIO))).map((participant, index) => {
              const { color, textColor } = participantColors[participant.ID_USUARIO] || { color: 'grey', textColor: 'black' };
              return (
                <div className="px-4" key={index}>
                  <div className="flex items-center my-2 border-b border-solid border-black border-opacity-20">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color, color: textColor }}
                    >
                      {participant.NOMBRE_USUARIO.charAt(0)}
                    </div>
                    <div className="ml-2">
                      <p className="text-lg font-medium">{participant.NOMBRE_USUARIO} {connectedUserList.find(user => user.userId === participant.NOMBRE_USUARIO) ? (<span className="text-sm font-light">{"(Conectado)"}</span>) : (<span className="text-sm font-light">{"(Desconectado)"}</span>)}</p>
                      <p className="italic">{participant.NOMBRE_CMP}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-md">Todos los participantes cuentan con tareas en esta iteración</p>
          )}
        </div>
        <div className="w-8/12  p-2 ">
          <div className="w-full flex justify-end m-0 p-0.5">
            <div class="btn-group">
            <button className="btn text-white" style={{ backgroundColor: currentColor }} onClick={downloadChat}>
            Descargar Chat
          </button>
              <button type="button" class="btn dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: currentColor, color: "white", border: "1px solid gray" }}>
                <span class="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu">
                {chats && chats.length > 0  ? (
                  chats.map((chat, index) => {
                    console.log(chat);
                    return (
                      <li key={index} value={chat.ITERACION_ID} onClick={() => handleChatClick(chat.ITERACION_ID)}><a class="dropdown-item" >{chat.ITERACION_ID === iteracionactual.ID ? "Iteración Actual " : ((chat.ENTREGA_ID === entregaactual.ID ? (iteraciones.find(iteracion => iteracion.ID === chat.ITERACION_ID)).Nombre_Iteracion + " de Entrega Actual" : `Iteración ${chat.ITERACION_ID}`+`Entrega ${chat.ENTREGA_ID}`)) }</a></li>
                    )
                  })
                ) : (<li><a class="dropdown-item text-black" >Sin chats Disponibles</a></li>)}
              </ul>
            </div>
          </div>
          <div className="h-screen bg- text-black">
            <div className='w-full h-5/6 border-2 rounded-lg shadow-md'>
              <form onSubmit={handleSubmit(onSubmit)} className="p-10 w-full h-full rounded-lg overflow-y-scroll flex flex-column justify-end bg-gradient-to-br from-green-400 via-yellow-400 to-red-500 bg-opacity-100" action="POST">
                <div className='sticky'>
                  <ul>
                    {messages.map((message, i) => (
                      <div className={`w-6/12 ${message.from === 'Yo' ? 'ml-auto' : 'mr-auto'}`} key={i}>
                        <div className={`w-fit ${message.from === 'Yo' ? 'ml-auto' : 'mr-auto'}`}>
                          <li className={`my-2 p-2 table text-md rounded-xl w-fit ${message.from === 'Yo' ? 'bg-blue-400 text-black' : 'bg-indigo-400'}`}>
                            <b className='text-md text-white-500'>{message.from}</b>: {message.data}
                          </li>
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
                <div className='d-flex gap-4 sticky'>
                  <textarea placeholder='Escribe un mensaje'
                    className="block w-5/6 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id="messageInput"
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={255}
                    rows={1}
                    {...register("CONTENIDO", { required: true, message: "Campo Requerido" })} />

                  <div className='d-flex'>
                    <button type="submit" className="btn btn-primary d-flex gap-2 ">
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
        </div>
      </div>
      {/**/}
    </div>
  );
}

export default ChatIteracion;