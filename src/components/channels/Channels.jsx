import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import { apiURL } from "../../App";

export function Channels({
  showAddChannel,
  setSelectedChannel,
  handleShowAddChannel,
}) {
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

  useEffect(() => {
    setSelectedChannel(null);
  }, []);

  return (
    <>
      <h1>Your Channels</h1>

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
      <button
        onClick={handleShowAddChannel}
        className="bg-slate-400 hover:bg-slate-600"
      >
        {!showAddChannel ? "Add Channel" : "Close"}
      </button>
    </>
  );
}
