import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [quote, setQuote] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("auth") === "true";
    if (!isLoggedIn) router.push("/login");

    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);

    // Fetch motivational quote
    fetch("https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setQuote(`${data[0].q} — ${data[0].a}`);
      })
      .catch(() => setQuote("“Keep going, you're doing great.” — TherapyBot"));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply || "I'm here to listen." }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, something went wrong." }]);
    }

    setInput("");
    setLoading(false);
  };

  const handleExport = () => {
    const content = messages.map(m => `${m.sender === 'user' ? 'You' : 'Bot'}: ${m.text}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "therapybot-chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-white text-black"} style={{ minHeight: "100vh" }}>
      <Head>
        <title>TherapyBot</title>
      </Head>

      <main className="p-4">
        <div className="max-w-2xl mx-auto rounded-lg overflow-hidden flex flex-col h-[90vh] border shadow-md"
             style={{ backgroundColor: darkMode ? "#1f2937" : "#f9f9f9" }}>

          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b"
               style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}>
            <h1 className="text-xl font-bold">💬 TherapyBot</h1>
            <div className="space-x-2">
              <button
                onClick={toggleTheme}
                className="px-3 py-1 rounded text-sm"
                style={{ backgroundColor: darkMode ? "#fbbf24" : "#1f2937", color: darkMode ? "#000" : "#fff" }}
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={handleExport}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Export Chat
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Motivational Quote */}
            {quote && (
              <div
                className="text-center italic text-sm text-gray-500 dark:text-gray-400 mb-2 p-2 border rounded"
                style={{ backgroundColor: darkMode ? "#111827" : "#f0f4f8" }}
              >
                {quote}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm`}
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
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-blue-400 text-sm">Bot is typing...</div>}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input & Prompt Templates */}
          <div className="p-4 border-t flex flex-col space-y-2"
               style={{ borderColor: darkMode ? "#374151" : "#e5e7eb" }}>
            <select
              onChange={(e) => setInput(e.target.value)}
              className="p-2 rounded border text-sm"
              style={{
                backgroundColor: darkMode ? "#111827" : "#fff",
                color: darkMode ? "#fff" : "#000",
                borderColor: darkMode ? "#4b5563" : "#d1d5db"
              }}
              value=""
            >
              <option value="">📝 Choose a prompt...</option>
              <option value="I feel anxious">😟 I feel anxious</option>
              <option value="I'm feeling overwhelmed">😫 I'm overwhelmed</option>
              <option value="I need help sleeping">😴 I need help sleeping</option>
              <option value="I'm feeling lonely">😔 I'm feeling lonely</option>
              <option value="I need motivation">💪 I need motivation</option>
            </select>

            <div className="flex">
              <input
                type="text"
                className="flex-1 p-2 rounded-l-lg border outline-none"
                style={{
                  backgroundColor: darkMode ? "#111827" : "#fff",
                  color: darkMode ? "#fff" : "#000",
                  borderColor: darkMode ? "#4b5563" : "#d1d5db"
                }}
                placeholder="How are you feeling?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
