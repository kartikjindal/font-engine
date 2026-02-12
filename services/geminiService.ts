
import { GoogleGenAI, Type } from "@google/genai";

export async function generateEpicPhrases() {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 short, powerful, cinematic phrases (max 4 words each) suitable for a movie trailer entrance. Return them as a JSON array of strings.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return ["THE WORLD AWAITS", "BEYOND THE HORIZON", "RISE OF LEGENDS", "SILENCE IS GOLDEN", "FATE OF KINGS"];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["THE WORLD AWAITS", "BEYOND THE HORIZON", "RISE OF LEGENDS", "SILENCE IS GOLDEN", "FATE OF KINGS"];
  }
}
