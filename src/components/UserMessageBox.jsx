import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { apiURL } from "../App";
import { UserSendMessageForm } from "./UserSendMessageForm";

export function UserMessageBox({ selectedUser, selectedUserName }) {
  const { accessData } = useAuth();
  const [messages, setMessages] = useState([]);

  async function fetchMessages(id) {
    const response = await fetch(
      `${apiURL}/messages?receiver_id=${id}&receiver_class=User`,
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
    fetchMessages(selectedUser);
  };

  useEffect(() => {
    fetchMessages(selectedUser);

    const intervalId = setInterval(fetchMessagesPeriodically, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedUser]);

  return (
    <div style={{ backgroundColor: "blue" }}>
      <h1>Hello {selectedUserName}!</h1>
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
      <UserSendMessageForm user={selectedUser} />
    </div>
  );
}
