import { GoogleGenAI } from "@google/genai";

// ✔ Vite uses import.meta.env, NOT process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("Gemini API key not found. Using mocked responses for chat.");
}

const model = "gemini-2.5-flash";

const systemInstruction = `
You are Flora, a friendly plant care assistant 🌱.

You primarily help with plant and plant-care related questions.

You MAY answer friendly or conversational questions such as:
- "What is your name?"
- "How are you?"
- "Who are you?"

For questions that are not about plants:
- Give a polite, friendly reply 😊
- Gently redirect the user back to plant-related topics 🌿

Occasionally remind the user that you specialize in plants 🌱.

Always keep answers short (2–3 sentences max).
Use 1–2 relevant emojis naturally in every reply.
Be warm, simple, and professional.
`;



// Mock response for cases where no API key is available
const getMockResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('yellow') && lowerMsg.includes('leave')) {
        return "Yellow leaves commonly indicate overwatering. Let top soil dry before watering.";
    } else if (lowerMsg.includes('brown') && (lowerMsg.includes('leave') || lowerMsg.includes('tip'))) {
        return "Brown tips often mean dry air or inconsistent watering. Increase humidity.";
    } else if (lowerMsg.includes('how often') && lowerMsg.includes('water')) {
        return "Water most plants when top 2 inches of soil dry. Succulents need less frequent watering.";
    } else if (lowerMsg.includes('light') || lowerMsg.includes('sun')) {
        return "Most houseplants thrive in bright indirect sunlight.";
    }

    return "I can help with plant care! Ask me about watering, lighting, pests, or leaf issues.";
};

export const getAiChatResponse = async (message: string): Promise<string> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockResponse(message);
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: message,
            config: {
                systemInstruction
            }
        });

        return response.text;
    } catch (error) {
        console.error("AI error:", error);
        return "Sorry, I'm having trouble connecting right now. Please try again.";
    }
};
