import { useAuth } from "../../AuthContext";
import { useEffect, useRef, useState } from "react";
import { apiURL } from "../../App";
import { UserSendMessageForm } from "./UserSendMessageForm";

export function UserMessageBox({ selectedUser, selectedUserName }) {
  const { accessData } = useAuth();
  const [messages, setMessages] = useState([]);
  const dummy = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

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

  function formatTimeAgo(timestamp) {
    const currentDate = new Date();
    const messageDate = new Date(timestamp);
    const timeDifference = currentDate - messageDate;

    if (timeDifference < 60000) {
      return "Just now";
    } else if (timeDifference < 3600000) {
      const minutesAgo = Math.floor(timeDifference / 60000);
      return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
    } else if (timeDifference < 86400000) {
      const hoursAgo = Math.floor(timeDifference / 3600000);
      return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
    } else if (timeDifference < 2592000000) {
      const daysAgo = Math.floor(timeDifference / 86400000);
      return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
    } else if (timeDifference < 31536000000) {
      const monthsAgo = Math.floor(timeDifference / 2592000000);
      return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
    } else {
      const yearsAgo = Math.floor(timeDifference / 31536000000);
      return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
    }
  }

  useEffect(() => {
    fetchMessages(selectedUser);

    const intervalId = setInterval(fetchMessagesPeriodically, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedUser]);

  useEffect(() => {
    if (shouldAutoScroll) {
      dummy.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, shouldAutoScroll]);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    const container = messageContainerRef.current;

    function handleScroll() {
      if (
        container.scrollHeight - container.scrollTop ===
        container.clientHeight
      ) {
        setShouldAutoScroll(true);
      } else {
        setShouldAutoScroll(false);
      }
    }

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-screen grid grid-rows-[auto_auto_1fr_auto] p-3">
      <h1 className="p-5">{selectedUserName.toUpperCase()}</h1>
      <h3 className="text-center text-xl font-bold my-5">Messages</h3>
      <div
        className="flex flex-col gap-4 overflow-y-auto p-5 pb-0 whitespace-pre-line"
        ref={messageContainerRef}
      >
        {messages &&
          (messages.length !== 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender.id === accessData.id ? "text-right" : ""
                }
              >
                {message.sender.id === accessData.id ? (
                  <p
                    className={`inline-block rounded-2xl rounded-br-none bg-slate-500 p-2  text-right`}
                  >
                    {message.body}
                  </p>
                ) : (
                  <p
                    className={`rounded-2xl inline-block rounded-bl-none bg-slate-500 p-2  `}
                  >
                    {message.body}{" "}
                  </p>
                )}
                <p className="text-xs italic ">
                  {formatTimeAgo(message.created_at)}
                </p>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          ))}
        <div className="dummy" ref={dummy}></div>
      </div>

      <UserSendMessageForm user={selectedUser} />
    </div>
  );
}
