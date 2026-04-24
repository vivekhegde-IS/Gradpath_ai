// frontend/app/chat/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const router = useRouter();

  const sendMessage = async (userMsg) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      // safely extract the response — handle multiple possible field names
      const reply =
        data?.response ||
        data?.message ||
        data?.text ||
        data?.content ||
        data?.detail ||
        JSON.stringify(data);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: String(reply) },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Insight: Could not connect to the AI backend.\nRecommendation: Make sure the backend server is running on port 8000.\nNext Action: Check your terminal for errors.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    const initialMessage =
      "Hello! Give me an overview of my profile and what I should do next.";
    setMessages([{ role: "user", text: initialMessage }]);
    sendMessage(initialMessage);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    await sendMessage(userMsg);
  };

  const renderMessageText = (text) => {
    // guard: if text is not a string, show fallback
    if (!text || typeof text !== "string") {
      return <p className="text-red-400">Could not parse response.</p>;
    }

    return text.split("\n").map((line, i) => {
      if (line.startsWith("Insight:")) {
        return (
          <p key={i} className="mb-2">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest mr-2">
              Insight:
            </span>
            {line.replace("Insight:", "").trim()}
          </p>
        );
      } else if (line.startsWith("Recommendation:")) {
        return (
          <p key={i} className="mb-2">
            <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest mr-2">
              Recommendation:
            </span>
            {line.replace("Recommendation:", "").trim()}
          </p>
        );
      } else if (line.startsWith("Next Action:")) {
        return (
          <p key={i} className="mb-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest mr-2">
              Next Action:
            </span>
            {line.replace("Next Action:", "").trim()}
          </p>
        );
      }
      return line ? <p key={i} className="mb-2">{line}</p> : null;
    });
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative">
        <header className="p-6 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold">GradPath AI Mentor</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
              Powered by Google Gemini
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              Online
            </span>
          </div>
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 pb-36"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] p-5 rounded-2xl shadow-lg ${msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-900 border border-slate-800 rounded-tl-none"
                  }`}
              >
                {msg.role === "ai" ? (
                  <div className="text-slate-300 leading-relaxed text-sm">
                    {renderMessageText(msg.text)}
                  </div>
                ) : (
                  <p className="font-medium text-sm">{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/90 to-transparent">
          <form
            onSubmit={handleSend}
            className="max-w-4xl mx-auto flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your university path..."
              className="flex-1 bg-slate-900 border border-slate-700 p-4 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}