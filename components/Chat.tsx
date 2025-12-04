import React, { useState, useEffect, useRef } from "react";
import { Send, Loader } from "lucide-react";
import type { ChatMessage } from "../types";
import { getAiChatResponse } from "../services/geminiService";

const Chat: React.FC = () => {
  // initial messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "bot", text: "🌿 Hi! I’m your Flora Companion. Ask me anything about plant care!" },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [userTypedOnce, setUserTypedOnce] = useState(false); // tracks if user typed to hide suggestions (if you keep them later)

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // set browser tab and optionally visible header title
  useEffect(() => {
    document.title = "Flora AI";
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  // word-by-word typing animation
  const typeMessage = (fullText: string) => {
    return new Promise<void>((resolve) => {
      setTypingText("");
      const words = fullText.split(" ");
      let index = 0;
      const interval = setInterval(() => {
        setTypingText((prev) => (index === 0 ? words[index] : prev + " " + words[index]));
        index++;
        if (index >= words.length) {
          clearInterval(interval);
          resolve();
        }
      }, 85);
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // mark user typed so any suggestion UI (if restored) will hide
    setUserTypedOnce(true);

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponseText = await getAiChatResponse(userMessage.text);
      await typeMessage(aiResponseText);
      setMessages((prev) => [...prev, { type: "bot", text: aiResponseText }]);
      setTypingText("");
    } catch {
      setMessages((prev) => [...prev, { type: "bot", text: "⚠️ Unable to get response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([{ type: "bot", text: "🌱 Hi! I’m your Flora Companion. Ask me anything!" }]);
    setInput("");
    setUserTypedOnce(false);
    setTypingText("");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-green-50 dark:bg-gray-900">

      {/* MOBILE FRAME */}
      <div className="w-[390px] h-[88vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-green-200 dark:border-gray-700">

        {/* TOP BAR with in-app title */}
        <div className="w-full bg-white dark:bg-gray-800 border-b border-green-100 dark:border-gray-700 p-3 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* optional small icon */}
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
              <svg className="w-5 h-5 text-green-700 dark:text-green-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 2C8 6 4 6 4 10s4 8 8 10 8-4 8-8-4-10-8-10z" fill="currentColor" />
              </svg>
            </div>
            {/* This is the in-app tab title the user asked for */}
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Chat</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Flora AI</div>
            </div>
          </div>

          {/* New chat button */}
          <button
            onClick={handleNewChat}
            aria-label="New chat"
            className="p-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
          >
            ✚
          </button>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 w-full overflow-hidden relative">

          {/* Scrollable messages (give bottom padding so input doesn't hide messages) */}
          <div className="h-full overflow-y-auto px-4 py-6 pb-36">
            {messages.map((msg, i) => (
              <div key={i} className={`flex mb-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-3 text-base leading-relaxed shadow-md break-words ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-white text-gray-900 border border-green-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing bubble (styled same as bot bubble to avoid color flashes) */}
            {isLoading && typingText && (
              <div className="flex justify-start mb-3">
                <div className="max-w-[85%] rounded-3xl px-5 py-3 text-base leading-relaxed shadow-md break-words bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-green-100 dark:border-gray-600">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* FIXED INPUT (no quick questions block) */}
          <div className="absolute bottom-4 left-0 w-full px-4 z-40 pointer-events-none">
            <div className="pointer-events-auto bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-2xl px-4 py-4 shadow-lg flex items-center gap-3">

              {/* Large input field */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="🌱 Ask about your plants..."
                className="flex-1 px-5 py-3 rounded-2xl border border-green-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
              />

              {/* Large send button */}
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 transform transition disabled:opacity-50"
                aria-label="Send message"
              >
                {isLoading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
