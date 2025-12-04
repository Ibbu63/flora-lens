import React, { useState, useEffect, useRef } from "react";
import { Send, Loader, Leaf } from "lucide-react";
import type { ChatMessage } from "../types";
import { getAiChatResponse } from "../services/geminiService";

const quickQuestions = [
  "Why are my leaves turning yellow?",
  "How often should I water?",
  "Why are my leaves brown at tips?",
  "My plant has droopy leaves, what should I do?",
  "How much sunlight does my plant need?",
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "bot", text: "🌿 Hi! I’m your Flora Companion. Ask me anything about plant care!" },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [showQuick, setShowQuick] = useState(true); // 👈 Controls quick questions

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Flora AI";
  }, []);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  // WORD-BY-WORD typing animation
  const typeMessage = (fullText: string) => {
    return new Promise<void>((resolve) => {
      setTypingText("");
      const words = fullText.split(" ");
      let index = 0;

      const interval = setInterval(() => {
        setTypingText((prev) =>
          index === 0 ? words[index] : prev + " " + words[index]
        );
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

    setShowQuick(false); // 👈 Hide quick questions when user types manually

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

  const handleQuick = async (q: string) => {
    if (isLoading) return;

    setShowQuick(false); // 👈 Hide after clicking

    const userMessage = { type: "user", text: q };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseText = await getAiChatResponse(q);
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
    setMessages([
      { type: "bot", text: "🌱 Hi! I’m your Flora Companion. Ask me anything!" },
    ]);
    setInput("");
    setTypingText("");
    setShowQuick(true); // 👈 Quick questions return here
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-green-50 dark:bg-gray-900">

      {/* MOBILE FRAME */}
      <div className="w-[390px] h-[88vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-green-200 dark:border-gray-700">

        {/* HEADER TITLE */}
        <div className="w-full bg-white dark:bg-gray-800 border-b border-green-100 dark:border-gray-700 p-3 px-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-300">Chat</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">Flora AI</div>
          </div>

          <button
  onClick={handleNewChat}
  className="p-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition flex items-center justify-center"
>
  <Leaf size={20} />
</button>

        </div>

        {/* CHAT BODY */}
        <div className="flex-1 w-full overflow-hidden relative">

          <div className="h-full overflow-y-auto px-4 py-6 pb-40">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
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

            {isLoading && typingText && (
              <div className="flex justify-start mb-3">
                <div className="max-w-[85%] rounded-3xl px-5 py-3 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border shadow-md">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* FIXED INPUT + QUICK QUESTIONS */}
          <div className="absolute bottom-4 left-0 w-full px-4 z-40 pointer-events-none">
            <div className="pointer-events-auto bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-2xl px-4 py-4 shadow-lg flex flex-col gap-3">

              {/* 🌿 QUICK QUESTIONS (show only at start) */}
              {showQuick && (
  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
    {quickQuestions.map((q, i) => (
      <button
        key={i}
        onClick={() => handleQuick(q)}
        className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold 
                   bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 
                   dark:text-green-300 transition-all hover:scale-[1.01] shadow-sm"
      >
        {q}
      </button>
    ))}
  </div>
)}


              {/* BIG input box */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="🌱 Ask about your plants..."
                  className="flex-1 px-5 py-3 rounded-2xl border border-green-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
                />

                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 transition disabled:opacity-50"
                >
                  {isLoading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;
