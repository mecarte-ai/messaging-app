import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import { apiURL } from "../../App";
import { AddChannelMember } from "./AddChannelMember";

export function ChannelDetails({ selectedChannel, users }) {
  const { accessData } = useAuth();
  const [channelDetails, setChannelDetails] = useState([]);
  const [showAddChannelMember, setShowAddChannelMember] = useState(false);

  const channelUsersId = channelDetails.data?.channel_members.map(
    (user) => user.user_id
  );

  const channelUsers = users.filter((user) =>
    channelUsersId?.includes(user.id)
  );

  const nonChannelUsers = users.filter(
    (user) => !channelUsersId?.includes(user.id)
  );

  async function fetchChannelDetails(id) {
    const response = await fetch(`${apiURL}/channels/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        ...accessData,
      },
    });

    const data = await response.json();
    setChannelDetails(data);
  }

  function fetchMessagesPeriodically() {
    fetchChannelDetails(selectedChannel);
  }

  useEffect(() => {
    const intervalId = setInterval(fetchMessagesPeriodically, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedChannel]);

  return (
    <div className="p-3 flex flex-col gap-3 overflow-hidden">
      <h3 className="text-xl font-bold my-5">Channel members</h3>
      {channelUsers &&
        channelUsers.map((user) => (
          <p key={user.id}>
            {user.uid}
            {channelDetails.data?.owner_id === user.id ? " (Owner)" : ""}
            {accessData.id === user.id ? " (You)" : ""}
          </p>
        ))}
      <button
        onClick={() => setShowAddChannelMember((show) => !show)}
        className="bg-slate-500 hover:bg-slate-600"
      >
        {showAddChannelMember ? "Close" : "Add member"}
      </button>
      {showAddChannelMember && (
        <AddChannelMember
          users={nonChannelUsers}
          setShowAddChannelMember={setShowAddChannelMember}
          selectedChannel={selectedChannel}
        />
      )}
    </div>
  );
}
