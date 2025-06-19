import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const decodeHTMLEntities = (text: string) => {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
};

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [quote, setQuote] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) router.push("/login");
  }, [router]); // ✅ Add router to dependencies

  useEffect(() => {
    fetch("https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuote(`${data[0].q} — ${data[0].a}`);
      });
  }, []);

  const handleSend = async () => {
    if (!input) return;

    const userInput = input;
    setChat([...chat, { sender: "user", text: userInput }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput }),
    });

    const data = await res.json();
    setChat((prev) => [...prev, { sender: "bot", text: data.reply }]);
  };

  return (
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
          ))}
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
      </div>
    </main>
  );
}
