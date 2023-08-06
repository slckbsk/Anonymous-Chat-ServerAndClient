import React, { useEffect, useRef } from "react";
import { useSubscription } from "@apollo/client";
import { GET_MESSAGES } from "./queries";
import "bootstrap/dist/css/bootstrap.min.css";

const Messages = ({ user }) => {
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { data } = useSubscription(GET_MESSAGES);

  useEffect(() => {
    scrollToBottom();
  }, [user, data]);

  if (!data) {
    return null;
  }


  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          ref={chatContainerRef}
          key={id}
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
            alignItems: "center",
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                display: "flex",
                height: 40,
                width: 100,
                border: "1px solid Black",
                borderRadius: "1em",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
              }}
            >
              {messageUser.slice(0, 8).toUpperCase()}
            </div>
          )}
          <div
            style={{
              display: "flex",
              background: user === messageUser ? "#58bf56" : "#F5F5F5",
              color: user === messageUser ? "white" : "black",
              borderRadius: "0.7em",
              maxWidth: "70%",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "1em",
              padding: "0.5em",
              border: "1px solid #e5e6ea",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
  );
};

export default Messages;
