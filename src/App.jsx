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
          </Route>
          <Route path="*" element={<h1>Page 404 not found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Dashboard() {
  const { setIsLogin, accessData, setAccessData } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [showAddChannel, setShowAddChannel] = useState(false);

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

  useEffect(() => {
    async function getUsers() {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers.data);
    }

    getUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.uid.toLowerCase().includes(query.toLowerCase())
  );

  function handleShowAddChannel() {
    setShowAddChannel((show) => !show);
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ backgroundColor: "red" }}>
        Welcome, {accessData.uid}
        <button
          onClick={() => {
            setIsLogin(false);
            setAccessData(null);
          }}
        >
          Logout
        </button>
        {users && <SearchUserForm onSearch={setQuery} query={query} />}
        {query.length > 3 ? (
          filteredUsers.length < 75 ? (
            filteredUsers.map((user) => (
              <div key={user.uid}>
                <p>{user.id}</p>
                <div>Hello {user.uid}</div>
                <SendMessageForm user={user} />
                <MessageBox userID={user.id} />
              </div>
            ))
          ) : (
            <h1>Too many results {filteredUsers.length}</h1>
          )
        ) : (
          <h1>Search a user</h1>
        )}
      </div>
      <div style={{ backgroundColor: "green" }}>
        <button onClick={handleShowAddChannel}>
          {!showAddChannel ? "Add Channel" : "Close"}
        </button>
        {showAddChannel && <AddChannelForm users={users} />}
      </div>
    </div>
  );
}

function AddChannelForm({ users }) {
  const [channelName, setChannelName] = useState("");
  const [query, setQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = users.filter((user) =>
    selectedUsers.includes(user.id) ? null : user
  );

  const addedUsers = users.filter((user) =>
    selectedUsers.includes(user.id) ? user : null
  );

  const queryUsers = filteredUsers.filter((user) =>
    user.uid.toLowerCase().includes(query.toLowerCase())
  );

  function handleAddUser(id) {
    setSelectedUsers((users) => [...users, id]);
    setQuery("");
  }

  function handleRemoveUser(id) {
    setSelectedUsers((users) => users.filter((user) => user !== id));
  }

  useEffect(() => {
    console.log(selectedUsers);
  }, [selectedUsers]);

  return (
    <form>
      <h1>Create a channel</h1>
      <input
        type="text"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Channel name"
      />
      <br />
      <h1>Added Users</h1>
      {addedUsers.map((user) => (
        <p key={user.id}>
          {user.uid}
          <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
        </p>
      ))}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a user"
      />
      <div
        style={{ maxHeight: "300px", overflow: "scroll", overflowX: "hidden" }}
      >
        {query.length > 3 ? (
          queryUsers.map((user) => (
            <p key={user.id}>
              {user.uid}
              <button onClick={() => handleAddUser(user.id)}>Add User</button>
            </p>
          ))
        ) : (
          <h1>Type to search</h1>
        )}
      </div>
      <button>Submit</button>
    </form>
  );
}

function MessageBox({ userID }) {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <>
      <button onClick={() => setShowMessage(!showMessage)}>View Message</button>
      {showMessage && <Messages userID={userID} />}
      {/* {messages && messages.data.map((message) => <p>message.body</p>)} */}
    </>
  );
}

function Messages({ userID }) {
  const [messages, setMessages] = useState([]);
  const { accessData } = useAuth();

  async function fetchMessages(id) {
    const response = await fetch(
      `${apiURL}/messages?receiver_id=${id}&receiver_class=User`,
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

  async function getMessages() {
    const msgs = await fetchMessages(userID);
    setMessages(msgs.data);
  }

  useEffect(() => {
    getMessages();

    const intervalId = setInterval(getMessages, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="">
      <h1>Messages for {userID}</h1>
      {messages &&
        messages.map((msg) => (
          <p
            key={msg.id}
            style={msg.sender.id === accessData.id ? { color: "red" } : {}}
          >
            {msg.body}
          </p>
        ))}
    </div>
  );
}

function SearchUserForm({ query, onSearch }) {
  return (
    <div className="">
      <label htmlFor="">Search user: </label>
      <input
        type="text"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />
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

function ProtectedRoute() {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
