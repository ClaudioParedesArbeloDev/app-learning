//bibliotecas
import { io } from "socket.io-client"; // Cliente de Socket.IO para comunicación en tiempo real
import { useState, useEffect, useRef } from "react"; // React hooks para el manejo de estado y efectos
import axios from "axios"; // Cliente HTTP para realizar solicitudes al servidor
import { CurrentURL } from "../../api/url"; // URL actual del servidor

//Estilos
import "./chat.css";

// Establecemos la conexión con el servidor de Socket.IO
const socket = io(CurrentURL);

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
        const sortedUsers = response.data
          .map((user) => ({...user, avatarUrl: user.avatar
              ? `${CurrentURL}/${user.dni}/${user.avatar}`
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

  socket.on("userConnected", handleUserConnected);

  // Limpia el listener cuando el componente se desmonta
  return () => {
    socket.off("userConnected", handleUserConnected);
  };
}, [connectedUsers]); // Aunque no necesitas que este efecto se ejecute cada vez que connectedUsers cambie, no está mal tenerlo aquí

  // Manejar la desconexión de un usuario
  useEffect(() => {
    const handleUserDisconnected = (userId) => {
      // Eliminar usuario de la lista de usuarios conectados
      setConnectedUsers((prevUsers) => prevUsers.filter(user => user !== userId));
      console.log('Usuario desconectado:', userId);
    };

    socket.on("userDisconnected", handleUserDisconnected);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, [connectedUsers]); // Aunque no necesitas que este efecto se ejecute cada vez que connectedUsers cambie, no está mal tenerlo aquí



  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que el mensaje no esté vacío
    if (message.trim() === "") return;
    // Crear nuevo mensaje con el contenido y el nombre de usuario
    const newMessage = {
      body: message,
      from: user.nickname ? user.nickname : user.nombre,
    };
    // Agregar el nuevo mensaje a la lista de mensajes
    setMessages([...messages, newMessage]);
    // Enviar el mensaje al servidor Socket.IO
    socket.emit("message", message);
    // Limpiar el campo de entrada
    setMessage("");
    inputRef.current.value = "";
  };

  // Efecto para recibir mensajes del servidor Socket.IO
  useEffect(() => {
    const receiveMessage = (message) =>
      setMessages((messages) => [...messages, message]);
    socket.on("message", receiveMessage);
    return () => socket.off("message", receiveMessage);
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
                {message.from}: {message.body}
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
                  <img src={user.avatarUrl} alt="" />{user.nickname ? user.nickname : user.nombre}
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
                  <img src={user.avatarUrl} alt="" />
                  {user.nickname ? user.nickname : user.nombre}
                </li>
              ))}
          </div>
        
      </div>
    </main>
  );
}

export default ChatComponent;
