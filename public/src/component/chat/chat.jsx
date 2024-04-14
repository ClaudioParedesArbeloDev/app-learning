//bibliotecas
import { io } from "socket.io-client"; // Cliente de Socket.IO para comunicación en tiempo real
import { useState, useEffect, useRef } from "react"; // React hooks para el manejo de estado y efectos
import axios from "axios"; // Cliente HTTP para realizar solicitudes al servidor
import { CurrentURL } from "../../api/url"; // URL actual del servidor

//Estilos
import "./chat.css";

// Establecemos la conexión con el servidor de Socket.IO
const socket = io('https://claudioparedes.site');

// Definimos nuestro componente de chat
function ChatComponent() {
  // Estado para almacenar los datos del usuario
  const [user, setUser] = useState({});
  // Estado para almacenar el mensaje actual
  const [message, setMessage] = useState("");
  // Estado para almacenar los mensajes anteriores
  const [messages, setMessages] = useState([]);
  
  // Estado para almacenar los usuarios
  const [users, setUsers] = useState([]);
  // Estado para almacenar la lista de usuarios conectados
  const [connectedUsers, setConnectedUsers] = useState([]);
  // Estado para almacenar la URL del avatar del usuario
  const [avatarUrl, setAvatarUrl] = useState("");
  // Definimos la referencia al input
  const inputRef = useRef(null);


  // Efecto que se ejecuta al cargar el componente para obtener los datos del usuario
  useEffect(() => {
    // Función para obtener los datos del usuario
    const fetchUserData = async () => {
      try {
        // Obtener los datos del usuario desde el servidor
        const response = await axios.get(`${CurrentURL}/api/profile`, {
          withCredentials: true,
        });
        // Verificar si hay nuevos datos del usuario
        if (response.status === 304) {
          console.log("No hay nuevos datos disponibles.");
          return;
        }

        // Actualizar los datos del usuario y la URL del avatar
        setUser(response.data);
        
        setAvatarUrl(
          response.data.avatar
            ? `${CurrentURL}/img/documentacion/${response.data.dni}/${response.data.avatar}`
            : `${CurrentURL}/img/avatar.png`
        );
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };

    // Función para obtener la lista de usuarios
    const fetchUserList = async () => {
      try {
        const response = await axios.get(`${CurrentURL}/api/users`, {
          withCredentials: true,
        });
        const sortedUsers = response.data.map((user) => ({
          ...user, avatarUrl: user.avatar
              ? `${CurrentURL}/img/documentacion/${user.dni}/${user.avatar}`
              : `${CurrentURL}/img/avatar.png`,
            connected: user.online,
          }))
          .sort((a, b) => {
            if (a.nickname && b.nickname) {
              return a.nickname.localeCompare(b.nickname);
            }
            return a.nombre.localeCompare(b.nombre);
          });
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    fetchUserData();
    fetchUserList();
  }, []);

 // Efecto que se ejecuta al cargar el componente para manejar la conexión
useEffect(() => {
  const handleUserConnected = (userId) => {
    // Agregar usuario a la lista de usuarios conectados
    setConnectedUsers((prevUsers) => [...prevUsers, userId]);
    console.log('Usuarios conectados:', userId); 
  };

  const handleUserDisconnected = (userId) => {
    setConnectedUsers((prevUsers) => prevUsers.filter(user => user !== userId));
    console.log('Usuario desconectado:', userId);
  };

  socket.on("userConnected", handleUserConnected);
  socket.on("userDisconnected", handleUserDisconnected);

  // Limpia el listener cuando el componente se desmonta
  return () => {
    socket.off("userConnected", handleUserConnected);
    socket.off("userDisconnected", handleUserDisconnected);
  };
}, []); 

useEffect(() => {
  // Función para obtener todos los mensajes de chat
  const fetchChatHistory = async () => {
    try {
      // Hacer una solicitud al servidor para obtener todos los mensajes de chat
      const response = await axios.get(`${CurrentURL}/api/messages`, {
        withCredentials: true,
      });
      // Verificar si hay mensajes disponibles
      if (response.status === 304 || !response.data.length) {
        console.log("No hay mensajes de chat disponibles.");
        return;
      }
      // Actualizar el estado de los mensajes con la conversación anterior
      setMessages(response.data);
    } catch (error) {
      console.error("Error al cargar la conversación anterior:", error);
    }
  };

  // Llamar a la función para obtener la conversación anterior al cargar el componente
  fetchChatHistory();
}, []);

useEffect(() => {
  if (user.id) socket.emit("login", user.id);
}, [user]);


  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que el mensaje no esté vacío
    if (message.trim() === "") return;
    // Crear nuevo mensaje con el contenido y el nombre de usuario
    const newMessage = {
      mensaje: message,
      usuario: user.nickname ? user.nickname : user.nombre,
    };
    // Agregar el nuevo mensaje a la lista de mensajes
    setMessages([...messages, newMessage]);
    // Enviar el mensaje al servidor Socket.IO
    socket.emit("chat_message", newMessage);
    console.log(newMessage)
    // Limpiar el campo de entrada
    setMessage("");
    inputRef.current.value = "";
  };

  // Efecto para recibir mensajes del servidor Socket.IO
  useEffect(() => {
    const receiveMessage = (message) =>
      setMessages((messages) => [...messages, message]);
    socket.on("chat_message", receiveMessage);
    return () => socket.off("chat_message", receiveMessage);
  }, []);

  // Efecto que se ejecuta al emitir el evento de inicio de sesión del usuario
  useEffect(() => {
    if (user.id) socket.emit("login", user.id);
  }, [user]); // Este efecto solo se ejecuta una vez al montar el componente

  // Renderizado del componente de chat
  return (
    <main className="mainChat">
      <h2 className="titleChat">General</h2>
      <div className="chat">
        <div className="wrapperChat">
          <ul className="chatLinea">
            {messages.map((message, i) => (
              <li key={i}>
                {message.usuario}: {message.mensaje}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="inputMessage"
            placeholder="escribe tu mensaje"
            onChange={(e) => setMessage(e.target.value)}
            ref={inputRef}
          />
          <button className="sendMessage">enviar</button>
        </form>
      </div>
      <div className="wrapperUsers">
        
          <div>
            <h3>Usuarios Conectados</h3>
            {users
              .filter((user) => connectedUsers.includes(user._id))
              .map((user, index) => (
                <li key={index}>
                  <span className="dot green"></span>
                  <div className="wrapperImg">
                    <img src={user.avatarUrl} alt="" />
                  </div>
                  {user.nickname ? user.nickname : user.nombre}
                </li>
              ))}
          </div>
          <div>
            <h3>Usuarios Desconectados</h3>
            {users
              .filter((user) => !connectedUsers.includes(user._id))
              .map((user, index) => (
                <li key={index}>
                  <span className="dot gray"></span>
                  <div className="wrapperImg">
                    <img src={user.avatarUrl} alt="" />
                  </div>
                  {user.nickname ? user.nickname : user.nombre}
                </li>
              ))}
          </div>
        
      </div>
    </main>
  );
}

export default ChatComponent;