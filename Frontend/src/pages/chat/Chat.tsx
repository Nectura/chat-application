import { useEffect, useState } from "react";
import { ChatMessageDTO } from "../../models/DTO/chat-message.DTO";
import { UserDTO } from "../../models/DTO/user.DTO";
import { Button, TextField } from "@mui/material";
import { SocketEvent } from "../../enums/socket-event.enum";
import { Socket, io as SocketClient } from "socket.io-client";
import { fireBaseAuth } from "../../firebase/firebase";
import { getFormattedDateTime } from "../../functions/date.functions";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../services/user.service";
import { fetchMessages } from "../../services/message.service";
import "./Chat.scss";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const chatHistory = document.querySelector(".chat-history");

  useEffect(() => {
    async function initializeSocket() {
      if (!fireBaseAuth.currentUser) return;
      try {
        const token = await fireBaseAuth.currentUser.getIdToken();
        if (!process.env.REACT_APP_API_URL) {
          throw new Error("REACT_APP_API_URL is not defined in the environment variables!");
        }
        const socketInstance = SocketClient(process.env.REACT_APP_API_URL, {
          secure: true,
          auth: {
            token: token,
          },
        });

        setSocket(socketInstance);

        socketInstance.on(SocketEvent.SocketServerConnection, () => {
          console.log("Connected to the server!");
        });

        socketInstance.on(
          SocketEvent.ChatMessageReceived,
          (message: ChatMessageDTO) => {
            console.log("Received message from server: ", message);
            setMessages((messages) => [...messages, message]);
          }
        );
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    }
    initializeSocket();
  }, []);

  const updateMessages = async () => {
    const messages = await fetchMessages();
    setMessages(messages);
  };

  const updateUsers = async () => {
    const userIds = messages.map((message) => message.senderId);
    const users = await fetchUsers(userIds);
    setUsers(users);
  }

  useEffect(() => {
    updateMessages();
  }, []);

  useEffect(() => {
    updateUsers();
    scrollToBottom();
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    if (!chatHistory) return;
    chatHistory.scrollTop = chatHistory.scrollHeight;
  };

  const getUserInfo = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const handleSend = () => {
    if (!fireBaseAuth.currentUser || message.trim() === "") return;
    socket?.emit(
      SocketEvent.ChatMessageSent,
      new ChatMessageDTO("1", fireBaseAuth.currentUser.uid, message)
    );
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter") return;
    handleSend();
  };

  const handleLogout = async () => {
    try {
      await fireBaseAuth.signOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="chat-window">
        <div className="chat-history">
          <ol>
            {messages
              .sort(function (a, b) {
                const firstTimeStamp = a.createdAt
                  ? new Date(a.createdAt).getTime()
                  : new Date().getTime();
                const secondTimeStamp = b.createdAt
                  ? new Date(b.createdAt).getTime()
                  : new Date().getTime();
                return firstTimeStamp - secondTimeStamp;
              })
              .map((message, index) => (
                <li className="chat-message" key={index}>
                  <span className="created-at">
                    [{getFormattedDateTime(message.createdAt)}]
                  </span>
                  <span className="author">
                    {getUserInfo(message.senderId)?.name}:
                  </span>
                  <span className="content">{message.message}</span>
                </li>
              ))}
          </ol>
        </div>
        <div className="message-input">
          <TextField
            variant="outlined"
            multiline={true}
            rows={2}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            inputProps={{ maxLength: 124 }}
            sx={{
              width: "85%",
              marginLeft: "5px",
            }}
          />
          <Button
            variant="outlined"
            onClick={handleSend}
            sx={{
              height: "90%",
              width: "12.7%",
              marginRight: "5px",
            }}
          >
            Send
          </Button>
        </div>
      </div>
      <br /> <br />
      <br />
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}
