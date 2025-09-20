// Fix: Removed unused imports Chat and GenerateContentResponse.
import { GoogleGenAI, Content } from "@google/genai";
import { RESUME_DATA_FOR_AI } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A friendly message for the developer if the API key is missing.
  // In a real app, you might handle this more gracefully.
  console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = `You are a helpful, friendly, and professional AI assistant for Ibrahim El Khalil's portfolio. Your purpose is to answer questions about his skills, experience, and professional background.
You MUST base your answers ONLY on the resume information provided below.
Do not invent or assume any details.
If a question is outside this scope (e.g., "what's the weather like?") or asks for personal opinions, politely decline and steer the conversation back to Ibrahim's professional qualifications.
Keep your answers concise, professional, and helpful. You can use markdown for formatting lists.

After providing a helpful answer, you MUST suggest 3 relevant follow-up questions the user might have.
Format your response as follows:
1. Your answer to the user's question.
2. On a new line, the exact token: [SUGGESTIONS]
3. On the next line, a valid JSON array of 3 distinct, short (under 10 words) string questions.

Example:
[Your answer here]
[SUGGESTIONS]
["What technologies did he use at Pixel?", "Tell me more about his leadership experience.", "What are his main skills in Python?"]

IMPORTANT:
- Always include the [SUGGESTIONS] token and the JSON array unless the user's query is a simple greeting (like "hello"), a thank you, or if you are declining to answer an off-topic question. In those cases, just provide the text response without the token or suggestions.
- The JSON must be a flat array of strings.

Here is Ibrahim El Khalil's resume data:
---
${RESUME_DATA_FOR_AI}
---
`;

const model = 'gemini-2.5-flash';

export const streamChatMessage = async (history: Content[]) => {
  if (!API_KEY) {
    // A generator that yields an error message if the API key is not available.
    async function* errorStream() {
      yield "Error: Gemini API key is not configured. Please contact the site owner.";
    }
    return errorStream();
  }
  
  try {
    const contents: Content[] = history;
    
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return (async function*() {
      for await (const chunk of responseStream) {
        yield chunk.text;
      }
    })();
  } catch (error) {
    console.error("Error streaming chat message:", error);
     async function* errorStream() {
      yield "Sorry, I encountered an error. Please try again.";
    }
    return errorStream();
  }
};
