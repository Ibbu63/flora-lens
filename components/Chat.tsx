import React, { useState, useEffect, useRef } from "react";
import { Send, Loader, MessageSquare } from "lucide-react";
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
  const [activeQuickQuestion, setActiveQuickQuestion] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  const typeMessage = (fullText: string) => {
    return new Promise<void>((resolve) => {
      setTypingText("");
      let index = 0;
      const interval = setInterval(() => {
        setTypingText((prev) => prev + (fullText[index] ?? ""));
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
          resolve();
        }
      }, 25);
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

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

  const handleQuickQuestion = async (q: string) => {
    if (isLoading) return;

    setActiveQuickQuestion(q);
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
    setActiveQuickQuestion(null);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-green-50 dark:bg-gray-900">

      {/* MOBILE FRAME */}
      <div className="w-[390px] h-[88vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-green-200 dark:border-gray-700">

        {/* TOP BAR */}
        <div className="w-full bg-white dark:bg-gray-800 border-b border-green-100 dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={handleNewChat}
            className="p-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-transform hover:scale-110"
          >
            <MessageSquare size={22} />
          </button>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 w-full overflow-hidden relative">

          {/* Scrollable messages */}
          <div className="h-full overflow-y-auto px-4 py-6 pb-40">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm leading-relaxed shadow-md break-words ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-white text-gray-800 border border-green-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && typingText && (
              <div className="flex justify-start mb-3 animate-fade-in">
                <div className="max-w-[85%] rounded-3xl px-5 py-3 bg-white dark:bg-gray-700 border border-green-100 dark:border-gray-600 shadow-md break-words">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* FIXED INPUT BOX + QUICK QUESTIONS */}
          <div className="absolute bottom-4 left-0 w-full px-4">
            <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-2xl px-4 py-4 shadow-lg flex flex-col gap-3">

              {!activeQuickQuestion && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      disabled={isLoading}
                      onClick={() => handleQuickQuestion(q)}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-md transition-transform hover:scale-105 dark:bg-green-900/50 dark:text-green-300"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="🌱 Ask about your plants..."
                  className="flex-1 px-4 py-2 rounded-2xl border border-green-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
                >
                  {isLoading ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
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
