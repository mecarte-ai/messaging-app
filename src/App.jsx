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
import "./App.css";

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
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedChannelName, setSelectedChannelName] = useState(null);

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

  function handleUserClick(id, name) {
    setSelectedUser((prev) => (prev === id ? null : id));
    setSelectedUserName((prev) => (prev === name ? null : name));
    if (selectedChannel) {
      setSelectedChannel(null);
      setSelectedChannelName(null);
    }
  }

  function handleChannelClick(id, name) {
    setSelectedChannel((prev) => (prev === id ? null : id));
    setSelectedChannelName((prev) => (prev === name ? null : name));
    if (selectedUser) {
      setSelectedUser(null);
      setSelectedUserName(null);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ backgroundColor: "yellow" }}>
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
              <div
                key={user.uid}
                onClick={() => handleUserClick(user.id, user.uid)}
                className="box"
              >
                <p>{user.id}</p>
                <div>Hello {user.uid}</div>
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
        {showAddChannel && (
          <AddChannelForm users={users} onShowChannel={setShowAddChannel} />
        )}
        <Channels
          showAddChannel={showAddChannel}
          setSelectedChannel={handleChannelClick}
        />
      </div>
      <div style={{ backgroundColor: "blue" }}>
        {selectedUser && (
          <UserMessageBox
            selectedUser={selectedUser}
            selectedUserName={selectedUserName}
          />
        )}
        {selectedChannel && (
          <ChannelMessageBox
            selectedChannel={selectedChannel}
            selectedChannelName={selectedChannelName}
            setSelectedChannelName={selectedChannelName}
          />
        )}
      </div>
    </div>
  );
}

function UserMessageBox({ selectedUser, selectedUserName }) {
  const { accessData } = useAuth();
  const [messages, setMessages] = useState([]);

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
    setMessages(data.data);
  }

  const fetchMessagesPeriodically = () => {
    fetchMessages(selectedUser);
  };

  useEffect(() => {
    fetchMessages(selectedUser);

    const intervalId = setInterval(fetchMessagesPeriodically, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedUser]);

  return (
    <div>
      <h1>Hello {selectedUserName}!</h1>
      <h3>Messages</h3>
      {messages &&
        messages.map((message) => (
          <p
            key={message.id}
            style={
              message.sender.id === accessData.id ? { color: "white" } : {}
            }
          >
            {message.body}
          </p>
        ))}
      <UserSendMessageForm user={selectedUser} />
    </div>
  );
}

function UserSendMessageForm({ user }) {
  const [message, setMessage] = useState("");
  const { accessData } = useAuth();

  async function handleSend(e, id) {
    e.preventDefault();

    const newMessage = {
      receiver_id: id,
      receiver_class: "User",
      body: message,
    };

    const res = await fetch(`${apiURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
      body: JSON.stringify(newMessage),
    });

    setMessage("");
  }

  return (
    <form action="" onSubmit={(e) => handleSend(e, user)}>
      <input
        type="text"
        name=""
        id=""
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button>Send message</button>
    </form>
  );
}

function ChannelMessageBox({ selectedChannel, selectedChannelName }) {
  const { accessData } = useAuth();
  const [messages, setMessages] = useState([]);

  async function fetchMessages(id) {
    const response = await fetch(
      `${apiURL}/messages?receiver_id=${id}&receiver_class=Channel`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...accessData,
        },
      }
    );

    const data = await response.json();
    setMessages(data.data);
  }

  const fetchMessagesPeriodically = () => {
    fetchMessages(selectedChannel);
  };

  useEffect(() => {
    fetchMessages(selectedChannel);

    const intervalId = setInterval(fetchMessagesPeriodically, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedChannel]);

  return (
    <div>
      <h1>Hello {selectedChannelName}!</h1>
      <h3>Messages</h3>
      {messages &&
        messages.map((message) => (
          <p
            key={message.id}
            style={
              message.sender.id === accessData.id ? { color: "white" } : {}
            }
          >
            {message.body}
          </p>
        ))}
      <ChannelSendMessageForm channel={selectedChannel} />
    </div>
  );
}

function ChannelSendMessageForm({ channel }) {
  const [message, setMessage] = useState("");
  const { accessData } = useAuth();

  async function handleSend(e, id) {
    e.preventDefault();

    const newMessage = {
      receiver_id: id,
      receiver_class: "Channel",
      body: message,
    };

    const res = await fetch(`${apiURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
      body: JSON.stringify(newMessage),
    });

    setMessage("");
  }

  return (
    <form action="" onSubmit={(e) => handleSend(e, channel)}>
      <input
        type="text"
        name=""
        id=""
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button>Send message</button>
    </form>
  );
}

function Channels({ showAddChannel, setSelectedChannel }) {
  const [channels, setChannels] = useState([]);
  const { accessData } = useAuth();

  async function fetchChannels() {
    const response = await fetch(`${apiURL}/channels`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
    });

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    async function getChannels() {
      const fetchedChannels = await fetchChannels();
      setChannels(fetchedChannels.data);
    }

    getChannels();
  }, [showAddChannel]);

  // async function fetchChannelDetails(id) {
  //   const response = await fetch(`${apiURL}/channels/${id}`, {
  //     method: "get",
  //     headers: {
  //       "Content-Type": "application/json",
  //       ...accessData,
  //     },
  //   });

  //   const data = await response.json();
  //   return data;
  // }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <h1>User Channels</h1>
        {channels &&
          channels.map((channel) => (
            <h1
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id, channel.name)}
              className="box"
            >
              {channel.name}
            </h1>
          ))}
      </div>
    </div>
  );
}

function AddChannelForm({ users, onShowChannel }) {
  const [channelName, setChannelName] = useState("");
  const [query, setQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { accessData } = useAuth();

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

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${apiURL}/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
      body: JSON.stringify({
        name: channelName,
        user_ids: selectedUsers,
      }),
    });

    onShowChannel(false);

    console.log("Submitted!");
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
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

function ProtectedRoute() {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
