import { useAuth } from "../../AuthContext";
import { useEffect, useState } from "react";
import { apiURL } from "../../App";
import { ChannelSendMessageForm } from "./ChannelSendMessageForm";

export function ChannelMessageBox({ selectedChannel, selectedChannelName }) {
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
    <div style={{ backgroundColor: "pink" }}>
      <h1>Welcome to {selectedChannelName}!</h1>
      <h3>Messages</h3>
      {messages &&
        messages.map((message) => (
          <p
            key={message.id}
            style={
              message.sender.id === accessData.id ? { color: "white" } : {}
            }
          >
            {message.sender.id === accessData.id ? "You" : message.sender.uid}:{" "}
            {message.body}
          </p>
        ))}
      <ChannelSendMessageForm channel={selectedChannel} />
    </div>
  );
}
