import { useAuth } from "../../AuthContext";
import { useState } from "react";
import { apiURL } from "../../App";

export function UserSendMessageForm({ user }) {
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
    <form
      onSubmit={(e) => handleSend(e, user)}
      className="mt-4 flex gap-2 p-5 py-0"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="grow text-black px-2"
      />
      <button className="px-2 bg-slate-500 rounded-md hover:bg-slate-600">
        Send message
      </button>
    </form>
  );
}
