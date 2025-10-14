import React, { useState, useEffect, useRef } from "react";
import { Send, Loader, MessageSquare } from "lucide-react";
import type { ChatMessage } from "../types";
import { getAiChatResponse } from "../services/aiService";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load API key safely from .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "❌ Missing Gemini API key. Add `VITE_GEMINI_API_KEY=your_api_key_here` in your .env file."
  );
}

// ✅ Initialize Gemini only if key is available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });

const quickQuestions = [
  "Why are my leaves turning yellow?",
  "How often should I water?",
  "Why are my leaves brown at tips?",
  "My plant has droopy leaves, what should I do?",
  "How much sunlight does my plant need?",
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      text: "Hi! I am your Flora Companion. Ask me anything about plant care, watering, lighting, pests, or troubleshooting!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuickQuestion, setActiveQuickQuestion] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponseText = await getAiChatResponse(input);
      const botMessage: ChatMessage = { type: "bot", text: aiResponseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const botMessage: ChatMessage = {
        type: "bot",
        text: "Error getting response from AI.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;

    setActiveQuickQuestion(question);
    const userMessage: ChatMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    getAiChatResponse(question).then((aiResponseText) => {
      const botMessage: ChatMessage = { type: "bot", text: aiResponseText };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    });
  };

  const handleNewChat = () => {
    setMessages([
      {
        type: "bot",
        text: "Hi! I am your Flora Companion. Ask me anything about plant care, watering, lighting, pests, or troubleshooting!",
      },
    ]);
    setActiveQuickQuestion(null);
    setInput("");
  };

  return (
    <div className="h-screen w-screen pt-20 pb-40 flex flex-col bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-slate-800 overflow-x-hidden">
      {/* 🌱 New Chat Icon */}
      <div className="fixed top-4 right-[10px] z-50">
        <button
          onClick={handleNewChat}
          className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* 💬 Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-6 py-4 shadow-lg ${
                msg.type === "user"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : "bg-white text-gray-800 border-2 border-green-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-3xl px-6 py-4 shadow-lg bg-white text-gray-800 border-2 border-green-100 flex items-center gap-2 dark:bg-gray-700 dark:border-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 🌿 Quick Questions */}
      <div className="fixed bottom-36 left-0 right-0 px-4">
        <div className="max-w-md mx-auto flex flex-wrap gap-2 justify-center">
          {!activeQuickQuestion &&
            quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                disabled={isLoading}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 hover:shadow-md transition transform hover:scale-105 dark:bg-green-900/50 dark:text-green-300"
              >
                {q}
              </button>
            ))}
        </div>
      </div>

      {/* ✏️ Input Box */}
      <div className="fixed bottom-24 left-0 right-0 bg-white border-t-2 border-green-100 p-4 shadow-2xl dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your plants..."
            className="flex-1 px-6 py-4 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-green-500 text-gray-800 font-medium dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-green-500"
          />
          <button
            onClick={handleSend}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-xl transition-all transform hover:scale-110 disabled:opacity-50 disabled:scale-100"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" size={24} /> : <Send size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
