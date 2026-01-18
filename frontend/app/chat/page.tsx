"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import "@/styles/ChatPage.css";

type Message = {
  id: number;
  author: string;
  text: string;
  time: string; // "18:05"
  isMe: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    author: "Tréner",
    text: "Ahojte, zajtra tréning o 18:00 na umelej tráve.",
    time: "17:20",
    isMe: false,
  },
  {
    id: 2,
    author: "Peter",
    text: "OK, prídem.",
    time: "17:22",
    isMe: true,
  },
  {
    id: 3,
    author: "Ján",
    text: "Ja meškám cca 10 minút.",
    time: "17:25",
    isMe: false,
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = new Date();
    const time = now.toLocaleTimeString("sk-SK", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: Message = {
      id: messages.length + 1,
      author: "Ja",
      text: trimmed,
      time,
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="chat-layout">
      <Sidebar />

      <main className="chat-main">
        <header className="chat-header">
          <h1 className="chat-title">Tímový chat</h1>
        </header>

        <section className="chat-window">
          <div className="chat-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-message-row ${m.isMe ? "me" : "other"}`}
              >
                {!m.isMe && (
                  <div className="chat-avatar">
                    {m.author.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className={`chat-bubble ${m.isMe ? "me" : "other"}`}>
                  {!m.isMe && <div className="chat-author">{m.author}</div>}
                  <div className="chat-text">{m.text}</div>
                  <div className="chat-time">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              className="chat-input"
              placeholder="Napíšte správu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="primary-button chat-send-button">
              Poslať
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
