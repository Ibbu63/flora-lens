// src/services/aiService.ts
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Load API key from .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ Gemini API key is missing. Please add it in your .env file as VITE_GEMINI_API_KEY");
  throw new Error("Missing Gemini API key");
}

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


// 🌿 Base instruction for both chat and Identify
const chatPrompt = `
You are an AI assistant specialized in plants and botany.
You help users identify plants, diagnose diseases, and offer plant care guidance.
Be brief, factual, and friendly.
`;

// === Text-based chat (for chat.tsx)
export async function getChatResponse(userInput: string): Promise<string> {
  try {
    const result = await model.generateContent([
      { text: `${chatPrompt}\nUser: ${userInput}` },
    ]);
    return result.response.text();
  } catch (error) {
    console.error("Chat error:", error);
    return "⚠️ I couldn’t process that right now. Please try again.";
  }
}

// System prompt instructing AI
const analyzePrompt = `
You are an expert plant pathologist.
Analyze the uploaded image of a plant leaf and identify if the plant has any disease.
Respond briefly and factually using this format:

Plant: [plant name or "Unknown"]
Disease: [disease name or "Healthy"]
Reason: [short reason or symptoms found]
Treatment: [short actionable suggestion or "None required"]
`;

export async function getAiChatResponse(imageBase64: string): Promise<string> {
  try {
    const result = await model.generateContent([
      { text: analyzePrompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(",")[1], // remove data:image/jpeg;base64,
        },
      },
    ]);

    return result.response?.text() || "No response from AI.";
  } catch (error) {
    console.error("AI detection error:", error);
    return "Sorry, I could not analyze the plant image right now.";
  }
}