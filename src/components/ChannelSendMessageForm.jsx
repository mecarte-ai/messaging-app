import { useAuth } from "../AuthContext";
import { useState } from "react";
import { apiURL } from "../App";

export function ChannelSendMessageForm({ channel }) {
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
