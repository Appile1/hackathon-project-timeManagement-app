"use client";
import React, { useState } from "react";
import "./page.css";
import ChatArea from "../chathelpai/ChatAi.js";

function ChatButton() {}
export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <button id="chatbot-button" onClick={toggleChat}>
        💬
      </button>

      <div id="chat-area" className={isChatOpen ? "active" : ""}>
        <div id="chat-area-header">Need Help?</div>
        <div id="chat-area-content">
          <ChatArea />
        </div>
      </div>
    </div>
  );
}
