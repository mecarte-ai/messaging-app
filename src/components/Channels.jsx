import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { apiURL } from "../App";

export function Channels({ showAddChannel, setSelectedChannel }) {
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
