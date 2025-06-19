import Head from 'next/head';Add commentMore actions
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function Chat() {
const decodeHTMLEntities = (text: string) => {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
};

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);Add commentMore actions
  const [darkMode, setDarkMode] = useState(false);
  const [quote, setQuote] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  function decodeHTMLEntities(text: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
  }
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("auth") === "true";
    if (!isLoggedIn) router.push("/login");

    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);

    fetch("https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data))
          setQuote(`${data[0].q} — ${data[0].a}`);
      })
      .catch(() =>
        setQuote("Keep going, don&#39;t worry, you\u2019re doing great.")
      );
  }, [router]);
    const auth = localStorage.getItem("auth");
    if (!auth) router.push("/login");
  }, [router]); // ✅ Add router to dependencies

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
    fetch("https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuote(`${data[0].q} — ${data[0].a}`);
      });
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply || "I\u2019m here to listen." }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, something went wrong." }]);
    }
    if (!input) return;

    const userInput = input;
    setChat([...chat, { sender: "user", text: userInput }]);
    setInput("");
    setLoading(false);
  };

  const handleExport = () => {
    const content = messages
      .map(m => `${m.sender === 'user' ? 'You' : 'Bot'}: ${decodeHTMLEntities(m.text)}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "therapybot-chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput }),
    });

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    const data = await res.json();
    setChat((prev) => [...prev, { sender: "bot", text: data.reply }]);
  };

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-white text-black"} style={{ minHeight: "100vh" }}>
      <Head><title>TherapyBot</title></Head>

      <main className="p-4">
        <div className="max-w-2xl mx-auto flex flex-col h-[90vh] border shadow-md rounded-lg overflow-hidden"
             style={{ backgroundColor: darkMode ? "#1f2937" : "#f9f9f9" }}>
          
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b"
               style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}>
            <h1 className="text-xl font-bold">💬 TherapyBot</h1>
            <div className="space-x-2">
              <button onClick={toggleTheme}
                className="px-3 py-1 rounded text-sm"
                style={{ backgroundColor: darkMode ? "#fbbf24" : "#1f2937", color: darkMode ? "#000" : "#fff" }}>
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button onClick={handleExport}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                Export Chat
              </button>
              <Link href="/login">
                <a className="px-3 py-1 text-sm text-blue-400 hover:underline">Logout</a>
              </Link>
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">🧠 TherapyBot</h1>

      {quote && (
        <div
          className="text-center italic text-sm text-gray-500 dark:text-gray-400 mb-2 p-2 border rounded"
          style={{ backgroundColor: "#f0f4f8" }}
        >
          {decodeHTMLEntities(quote)}
        </div>
      )}

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-4 rounded shadow-md">
        <div className="h-64 overflow-y-auto mb-4">
          {chat.map((msg, i) => (
            <div key={i} className={`mb-2 text-${msg.sender === "user" ? "right" : "left"}`}>
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {msg.text}
              </span>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {quote && (
              <div className="text-center italic text-sm mb-2 p-2 border rounded text-gray-500 dark:text-gray-400"
                   style={{ backgroundColor: darkMode ? "#111827" : "#f0f4f8" }}>
                {decodeHTMLEntities(quote)}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="px-4 py-2 rounded-lg max-w-xs break-words text-sm"
                     style={{
                       backgroundColor: msg.sender === 'user'
                         ? "#3b82f6"
                         : darkMode
                           ? "#374151"
                           : "#e5e7eb",
                       color: msg.sender === 'user'
                         ? "#fff"
                         : darkMode
                           ? "#fff"
                           : "#000"
                     }}>
                  {decodeHTMLEntities(msg.text)}
                </div>
              </div>
            ))}
            {loading && <div className="text-blue-400 text-sm">Bot is typing...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 flex flex-col space-y-2 border-t"
               style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}>
            <select onChange={e => setInput(e.target.value)} value=""
                    className="p-2 rounded border text-sm"
                    style={{
                      backgroundColor: darkMode ? "#111827" : "#fff",
                      color: darkMode ? "#fff" : "#000",
                      borderColor: darkMode ? "#4b5563" : "#d1d5db"
                    }}>
              <option value="">📝 Choose a prompt...</option>
              <option value="I feel anxious">😟 I feel anxious</option>
              <option value="I\u2019m feeling overwhelmed">😫 I\u2019m feeling overwhelmed</option>
              <option value="I need help sleeping">😴 I need help sleeping</option>
              <option value="I\u2019m feeling lonely">😔 I\u2019m feeling lonely</option>
              <option value="I need motivation">💪 I need motivation</option>
            </select>

            <div className="flex">
              <input type="text"
                     className="flex-1 p-2 rounded-l-lg border outline-none"
                     style={{
                       backgroundColor: darkMode ? "#111827" : "#fff",
                       color: darkMode ? "#fff" : "#000",
                       borderColor: darkMode ? "#4b5563" : "#d1d5db"
                     }}
                     placeholder="How are you feeling?"
                     value={input}
                     onChange={e => setInput(e.target.value)}
                     onKeyDown={e => e.key === "Enter" && handleSend()} />
          ))}
        </div>

              <button onClick={handleSend}
                      className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        <div className="flex">
          <input
            type="text"
            ref={inputRef}
            className="flex-1 px-3 py-2 border rounded-l"
            placeholder="Talk to me..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </main>
    </div>
      </div>
    </main>
  );
