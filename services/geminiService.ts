import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("Gemini API key not found. Using mocked responses for chat.");
}

const model = 'gemini-2.5-flash';

const systemInstruction = `You are Flora, a friendly and knowledgeable plant care expert. 
Your goal is to provide concise, helpful, and easy-to-understand advice for houseplant owners. 
When asked a question, provide a practical and actionable answer.
If a question is not about plants, gardening, or botany, politely state that you are a plant care specialist and cannot answer that question.
Keep your answers focused and to the point.`;

const getMockResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('yellow') && lowerMsg.includes('leave')) {
        return 'Yellow leaves commonly indicate overwatering. Check if soil is soggy and ensure proper drainage. Let the top 2 inches dry before watering again. Could also be nutrient deficiency - consider fertilizing if you haven\'t recently.';
    } else if (lowerMsg.includes('brown') && (lowerMsg.includes('leave') || lowerMsg.includes('tip'))) {
        return 'Brown leaf tips usually mean low humidity or underwatering. Try misting leaves daily, using a humidifier, or placing plants on pebble trays. Also check if you\'re using tap water with high mineral content - switch to filtered water.';
    } else if (lowerMsg.includes('how often') && lowerMsg.includes('water')) {
        return 'Watering frequency depends on the plant type. General rule: water when top 2 inches of soil are dry. Most houseplants need water every 7-10 days. Succulents can go 2-3 weeks. Always check soil moisture before watering!';
    } else if (lowerMsg.includes('light') || lowerMsg.includes('sun')) {
        return 'Light needs vary by plant. Bright indirect light means near a window but not in direct sun beam. Low light is 6-8 feet from window. Direct light is full sun exposure. Most houseplants prefer bright indirect light.';
    } else {
        return 'I can help with plant care! Ask me about watering, lighting, pests, yellowing leaves, or any specific plant questions.';
    }
}

export const getAiChatResponse = async (message: string): Promise<string> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
        return getMockResponse(message);
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: message,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
};
