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

  useEffect(() => {}, [selectedUsers]);

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

    const data = await res.json();

    if (data.errors) {
      alert(data.errors[0]);
      return;
    }

    onShowChannel(false);
  }

  return (
    <div
      className="absolute inset-0 h-screen w-screen grid place-items-center bg-black/70"
      onClick={() => onShowChannel(false)}
    >
      <form
        onSubmit={(e) => handleSubmit(e)}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-700  max-h-[450px] max-w-[450px] min-h-[450px] min-w-[450px] overflow-hidden grid grid-rows-[auto_auto_1fr_auto] gap-3 p-5"
      >
        <div className="text-center flex flex-col gap-2">
          <h1 className=" text-4xl">Create a channel</h1>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel name"
            className="text-black w-[90%] mx-auto"
          />
        </div>
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl">Added Users</h1>
          <div className="">
            {addedUsers.map((user) => (
              <p key={user.id} className="flex gap-2 justify-between text-left">
                {user.uid}
                <button onClick={() => handleRemoveUser(user.id)}>
                  Remove
                </button>
              </p>
            ))}
          </div>
        </div>
        <div className="text-center grid grid-rows-[auto_1fr] overflow-hidden">
          <div>
            <h1 className="text-2xl mb-2">Search Users</h1>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a user"
              className="text-black w-[90%] mx-auto"
            />
          </div>
          <div className="overflow-y-auto mt-5 px-5 gap-2 flex flex-col">
            {query.length > 3 ? (
              queryUsers.map((user) => (
                <p
                  key={user.id}
                  className="flex gap-2 justify-between text-left"
                >
                  {user.uid}
                  <button onClick={() => handleAddUser(user.id)}>
                    Add User
                  </button>
                </p>
              ))
            ) : (
              <h1>Type to search</h1>
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <button className="p-1">Submit</button>
          <button className="p-1">Close</button>
        </div>
      </form>
    </div>
  );
}
