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
You are Flora, a plant care expert.
Always give short, concise answers: maximum 2-3 sentences.
Explain only the most important action steps.
Avoid long paragraphs, avoid too much detail.
Be simple, professional, and straight to the point.
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

const isPlantRelated = (message: string): boolean => {
    const plantKeywords = [
        "plant", "leaf", "leaves", "watering", "water",
        "soil", "fertilizer", "sunlight", "light",
        "root", "stem", "flower", "garden",
        "pest", "fungus", "yellow", "brown",
        "growth", "pruning", "repot", "pot"
    ];

    const lowerMsg = message.toLowerCase();
    return plantKeywords.some(keyword => lowerMsg.includes(keyword));
};


export const getAiChatResponse = async (message: string): Promise<string> => {

    // 🚫 Non-plant question handler
    if (!isPlantRelated(message)) {
        return "❌ This question is not related to plants. I can only help with plant care.";
    }

    // 🟡 If API key is missing → mock response
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
