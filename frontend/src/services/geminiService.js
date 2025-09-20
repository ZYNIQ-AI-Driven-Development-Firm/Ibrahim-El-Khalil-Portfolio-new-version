import { GoogleGenerativeAI } from "@google/generative-ai";
import { RESUME_DATA_FOR_AI } from '../constants';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(API_KEY || 'demo-key');

const systemInstruction = `You are a helpful, friendly, and professional AI assistant for Ibrahim El Khalil's portfolio. Your purpose is to answer questions about his skills, experience, and professional background.
You MUST base your answers ONLY on the resume information provided below.
Do not invent or assume any details.
If a question is outside this scope (e.g., "what's the weather like?") or asks for personal opinions, politely decline and steer the conversation back to Ibrahim's professional qualifications.
Keep your answers concise, professional, and helpful. You can use markdown for formatting lists.

Resume Information:
${RESUME_DATA_FOR_AI}

When answering:
1. Be professional but conversational
2. Use bullet points for lists
3. Highlight key achievements and technologies
4. If asked about specific skills or technologies, mention the relevant projects and experience
5. If someone asks how to contact Ibrahim, mention the LinkedIn and email options available on the portfolio
6. Always stay within the scope of the provided resume information
`;

export const streamChatMessage = async (message, onChunk) => {
  if (!API_KEY) {
    onChunk("Error: Gemini API key is not configured. Please contact the site owner.");
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    const result = await model.generateContentStream(message);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    onChunk("Sorry, I'm having trouble connecting to the AI service. Please try again later.");
  }
};