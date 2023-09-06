import Login from "./Login";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./AuthContext";
import Registration from "./Registration";
import { useEffect, useState } from "react";

export const apiURL = "http://206.189.91.54/api/v1";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/messaging-app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test" element={<Test />} />
          </Route>
          <Route path="*" element={<h1>Page 404 not found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Dashboard() {
  const { setIsLogin, accessData, setAccessData } = useAuth();
  const [users, setUsers] = useState(null);
  const [messages, setMessages] = useState(null);

  async function fetchUsers() {
    const response = await fetch(`${apiURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
    });

    const data = await response.json();
    return data;
  }

  async function fetchMessages() {
    const response = await fetch(
      `${apiURL}/messages?receiver_id=54&receiver_class=User`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...accessData,
        },
      }
    );

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    async function getUsers() {
      const fetchedUsers = await fetchUsers();
      const filter = await fetchedUsers.data.slice(0, 10);
      setUsers(filter);
    }

    async function getMessages() {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    }

    getUsers();
    getMessages();
  }, []);

  return (
    <div>
      Welcome, {accessData.uid}
      <button
        onClick={() => {
          setIsLogin(false);
          setAccessData(null);
        }}
      >
        Logout
      </button>
      {users ? (
        users.map((user) => (
          <div key={user.uid}>
            <p>{user.id}</p>
            <div>Hello {user.uid}</div>
            <SendMessageForm user={user} />
          </div>
        ))
      ) : (
        <h1>Loading users...</h1>
      )}
      <h1>Messages</h1>
      {messages &&
        messages.data.map((message) => (
          <div key={message.id}>
            <p>{message.sender.uid}</p>
            <div>{message.body}</div>
          </div>
        ))}
    </div>
  );
}

function SendMessageForm({ user }) {
  const [message, setMessage] = useState("");
  const { accessData } = useAuth();

  async function handleSend(e, id) {
    e.preventDefault();

    const newMessage = {
      receiver_id: id,
      receiver_class: "User",
      body: message,
    };

    console.log(newMessage);

    const res = await fetch(`${apiURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
      body: JSON.stringify(newMessage),
    });

    console.log(accessData);

    console.log(id);
  }

  return (
    <form action="" onSubmit={(e) => handleSend(e, user.id)}>
      <input
        type="text"
        name=""
        id=""
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button>Send message</button>
      {message}
    </form>
  );
}

function Test() {
  return <h1>Test</h1>;
}

function ProtectedRoute() {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
