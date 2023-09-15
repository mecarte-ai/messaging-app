import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { ChannelDetails } from "./components/channels/ChannelDetails";
import { UserMessageBox } from "./components/users/UserMessageBox";
import { ChannelMessageBox } from "./components/channels/ChannelMessageBox";
import { Channels } from "./components/channels/Channels";
import { AddChannelForm } from "./components/channels/AddChannelForm";
import { SearchUserForm } from "./components/users/SearchUserForm";
import { apiURL } from "./App";

export function Dashboard() {
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
        <UsersList
          query={query}
          filteredUsers={filteredUsers}
          handleUserClick={handleUserClick}
        />
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
      <div>
        {selectedUser && (
          <UserMessageBox
            selectedUser={selectedUser}
            selectedUserName={selectedUserName}
          />
        )}
        {selectedChannel && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <ChannelMessageBox
              selectedChannel={selectedChannel}
              selectedChannelName={selectedChannelName}
              setSelectedChannelName={selectedChannelName}
            />
            <ChannelDetails selectedChannel={selectedChannel} users={users} />
          </div>
        )}
      </div>
    </div>
  );
}

function UsersList({ query, filteredUsers, handleUserClick }) {
  return (
    <>
      {query.length > 3 ? (
        filteredUsers.length < 25 ? (
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
          <h1>{filteredUsers.length} results found</h1>
        )
      ) : (
        <h1>Search a user</h1>
      )}
    </>
  );
}
