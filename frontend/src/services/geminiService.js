import { GoogleGenerativeAI } from "@google/generative-ai";
import { RESUME_DATA_FOR_AI } from '../constants';

// For Create React App, we need to use REACT_APP_ prefix
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Cache for AI instructions
let cachedInstructions = null;
let instructionsLoadTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch AI instructions from backend
const fetchAIInstructions = async () => {
  // Return cached instructions if still valid
  if (cachedInstructions && instructionsLoadTime && (Date.now() - instructionsLoadTime < CACHE_DURATION)) {
    return cachedInstructions;
  }

  try {
    const response = await fetch('/api/ai-instructions');
    if (response.ok) {
      const data = await response.json();
      cachedInstructions = data.instructions;
      instructionsLoadTime = Date.now();
      return cachedInstructions;
    }
  } catch (error) {
    console.error('Error fetching AI instructions:', error);
  }

  // Fallback to default instructions
  return `You are Ibrahim El Khalil's AI assistant, helping visitors learn about his portfolio and capabilities.

Key Guidelines:
- Be professional, friendly, and helpful
- Provide accurate information about Ibrahim's experience, skills, and projects
- Guide users to relevant sections of the portfolio
- Answer questions about his work, education, and achievements
- If you don't know something, be honest and suggest contacting Ibrahim directly

Remember to maintain a conversational tone while being informative and respectful.`;
};

// Build system instruction with resume data
const buildSystemInstruction = async () => {
  const customInstructions = await fetchAIInstructions();
  
  return `${customInstructions}

Resume Information (Use this as your knowledge base):
${RESUME_DATA_FOR_AI}

When answering:
1. Be professional but conversational
2. Use bullet points for lists
3. Highlight key achievements and technologies
4. If asked about specific skills or technologies, mention the relevant projects and experience
5. If someone asks how to contact Ibrahim, mention the LinkedIn and email options available on the portfolio
6. Always stay within the scope of the provided resume information
`;
};

export const streamChatMessage = async (message, onChunk) => {
  if (!API_KEY || !genAI) {
    onChunk("Error: Gemini API key is not configured. Please contact the site owner.");
    return;
  }

  try {
    const systemInstruction = await buildSystemInstruction();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
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