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
        className="flex flex-col gap-4 overflow-y-auto p-5 pb-0"
        ref={messageContainerRef}
      >
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className={
                message.sender.id === accessData.id ? "text-right" : ""
              }
            >
              {message.sender.id === accessData.id ? (
                <>
                  <span
                    className={`${
                      message.body.length < 100
                        ? "rounded-full inline-block"
                        : "rounded-2xl block"
                    } rounded-br-none bg-slate-500 p-2  text-right`}
                  >
                    {message.body}{" "}
                  </span>
                  <p className="text-xs italic ">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className={`${
                      message.body.length < 100
                        ? "rounded-full inline-block"
                        : " rounded-2xl block"
                    } rounded-bl-none bg-slate-500 p-2  `}
                  >
                    {message.body}{" "}
                  </p>
                  <p className="text-xs italic">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>{" "}
                </>
              )}
            </div>
          ))}
        <div className="dummy" ref={dummy}></div>
      </div>

      <UserSendMessageForm user={selectedUser} />
    </div>
  );
}
