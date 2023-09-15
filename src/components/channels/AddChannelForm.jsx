import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import { apiURL } from "../../App";

export function AddChannelForm({ users, onShowChannel }) {
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
