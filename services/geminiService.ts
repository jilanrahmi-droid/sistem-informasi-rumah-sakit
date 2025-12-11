import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AgentType } from "../types";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY not found in environment variables");
      // Fallback for demo purposes if strictly necessary, but sticking to guidelines
      throw new Error("API Key is missing.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const initializeChat = async (): Promise<Chat> => {
  const ai = getGenAI();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToAgent = async (message: string): Promise<{ text: string; agent: AgentType }> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  try {
    const result = await chatSession.sendMessage({ message });
    const responseText = result.text || "Maaf, saya tidak dapat memproses permintaan saat ini.";
    
    // Parse the agent tag from the response (e.g., "[Manajer Informasi Pasien] Answer...")
    let detectedAgent = AgentType.COORDINATOR;
    let cleanText = responseText;

    const agentMatch = responseText.match(/^\[(.*?)\]/);
    if (agentMatch && agentMatch[1]) {
      const tag = agentMatch[1];
      cleanText = responseText.replace(/^\[.*?\]\s*/, '');
      
      // Map string to Enum
      if (Object.values(AgentType).includes(tag as AgentType)) {
        detectedAgent = tag as AgentType;
      }
    }

    return {
      text: cleanText,
      agent: detectedAgent
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Terjadi kesalahan koneksi dengan sistem AI. Silakan coba lagi.",
      agent: AgentType.UNKNOWN
    };
  }
};