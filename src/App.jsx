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
  const [selectedChannel, setSelectedChannel] = useState(null);

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

  function handleUserClick(user) {
    setSelectedUser((prev) => (prev === user ? null : user));
    if (selectedChannel) {
      setSelectedChannel(null);
    }
  }

  function handleChannelClick(channel) {
    setSelectedChannel((prev) => (prev === channel ? null : channel));
    if (selectedUser) {
      setSelectedUser(null);
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
                onClick={() => handleUserClick(user.uid)}
                className="box"
              >
                <p>{user.id}</p>
                <div>Hello {user.uid}</div>
                {/* <SendMessageForm user={user} />
                <MessageBox userID={user.id} /> */}
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
        {selectedUser && <UserMessageBox selectedUser={selectedUser} />}
        {selectedChannel && (
          <ChannelMessageBox selectedChannel={selectedChannel} />
        )}
      </div>
    </div>
  );
}

function UserMessageBox({ selectedUser }) {
  return <h1>Hello {selectedUser}!</h1>;
}

function ChannelMessageBox({ selectedChannel }) {
  return <h1>Welcome to {selectedChannel}!</h1>;
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
              onClick={() => setSelectedChannel(channel.name)}
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

// function MessageBox({ userID }) {
//   const [showMessage, setShowMessage] = useState(false);

//   return (
//     <>
//       <button onClick={() => setShowMessage(!showMessage)}>View Message</button>
//       {showMessage && <Messages userID={userID} />}
//       {/* {messages && messages.data.map((message) => <p>message.body</p>)} */}
//     </>
//   );
// }

// function Messages({ userID }) {
//   const [messages, setMessages] = useState([]);
//   const { accessData } = useAuth();

//   async function fetchMessages(id) {
//     const response = await fetch(
//       `${apiURL}/messages?receiver_id=${id}&receiver_class=User`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           ...accessData,
//         },
//       }
//     );

//     const data = await response.json();
//     return data;
//   }

//   async function getMessages() {
//     const msgs = await fetchMessages(userID);
//     setMessages(msgs.data);
//   }

//   useEffect(() => {
//     getMessages();

//     const intervalId = setInterval(getMessages, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div className="">
//       <h1>Messages for {userID}</h1>
//       {messages &&
//         messages.map((msg) => (
//           <p
//             key={msg.id}
//             style={msg.sender.id === accessData.id ? { color: "red" } : {}}
//           >
//             {msg.body}
//           </p>
//         ))}
//     </div>
//   );
// }

// function SendMessageForm({ user }) {
//   const [message, setMessage] = useState("");
//   const { accessData } = useAuth();

//   async function handleSend(e, id) {
//     e.preventDefault();

//     const newMessage = {
//       receiver_id: id,
//       receiver_class: "User",
//       body: message,
//     };

//     console.log(newMessage);

//     const res = await fetch(`${apiURL}/messages`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...accessData,
//       },
//       body: JSON.stringify(newMessage),
//     });

//     console.log(accessData);

//     console.log(id);
//   }

//   return (
//     <form action="" onSubmit={(e) => handleSend(e, user.id)}>
//       <input
//         type="text"
//         name=""
//         id=""
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button>Send message</button>
//       {message}
//     </form>
//   );
// }

function ProtectedRoute() {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
