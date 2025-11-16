
import { GoogleGenAI, Content } from "@google/genai";

// FIX: Per coding guidelines, API key must be read directly from process.env and used in initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationMessage = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, powerful, one-sentence motivational quote for a 10th-grade student preparing for their board exams. Keep it concise, inspiring, and under 15 words.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching motivation message:", error);
    throw new Error("Could not fetch a motivational message.");
  }
};

// FIX: Replaced inefficient chat creation on every message with a stateless `generateContent` call.
// This is more performant and aligns better with the stateless nature of the component.
export const getChatbotResponse = async (history: Content[], newMessage: string): Promise<string> => {
  try {
    const contents: Content[] = [...history, { role: 'user', parts: [{ text: newMessage }] }];
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are an expert AI tutor for a CBSE Class 10 student in India. Your name is 'StudyBot'. Answer their study-related questions clearly and concisely. Help them understand concepts, but do not give them direct answers to homework or assignments. Keep your tone encouraging and friendly. Use simple language.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    throw new Error("Could not get a response from the chatbot.");
  }
};
