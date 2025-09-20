import React, { useState, useRef, useEffect, useCallback } from 'react';
import { streamChatMessage } from '../services/geminiService';
import { ChatMessage, MessageSender } from '../types';
import { SendIcon, BotIcon, UserIcon, CloseIcon, MicrophoneIcon, MailIcon } from './icons';
import { Content } from '@google/genai';
import ReactMarkdown from 'react-markdown';

// Web Speech API interfaces for cross-browser compatibility
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}
declare var SpeechRecognition: { new(): SpeechRecognition };
declare var webkitSpeechRecognition: { new(): SpeechRecognition };


const CrackSVG: React.FC<{style?: React.CSSProperties}> = ({style}) => (
    <div className="crack-effect" style={style}>
        <svg viewBox="0 0 200 200" preserveAspectRatio="none">
            <path d="M20 20 L180 180" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="1" />
            <path d="M20 180 L180 20" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="0.5" />
        </svg>
    </div>
);

const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Voice state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);


  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech Synthesis not supported.");
        return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: ChatMessage = { sender: MessageSender.USER, text: messageText };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setInput('');
    setSuggestions([]);
    setIsLoading(true);

    const history: Content[] = currentMessages.map(msg => ({
        role: msg.sender === MessageSender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));
    
    let aiResponseText = '';
    const newAiMessage: ChatMessage = { sender: MessageSender.AI, text: '' };
    setMessages(prev => [...prev, newAiMessage]);

    let firstChunk = true;
    try {
      const stream = await streamChatMessage(history);
      for await (const chunk of stream) {
          if (firstChunk) {
              setIsLoading(false);
              firstChunk = false;
          }
        aiResponseText += chunk;
        setMessages(prev => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.sender === MessageSender.AI) {
                lastMessage.text = aiResponseText;
            }
            return updatedMessages;
        });
      }
      
      let finalAiText = aiResponseText;
      if (aiResponseText.includes('[SUGGESTIONS]')) {
        const parts = aiResponseText.split('[SUGGESTIONS]');
        const mainText = parts[0].trim();
        finalAiText = mainText;
        const suggestionsJson = parts[1].trim();
        try {
            const parsedSuggestions = JSON.parse(suggestionsJson);
            setSuggestions(parsedSuggestions);
            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage && lastMessage.sender === MessageSender.AI) {
                    lastMessage.text = mainText;
                }
                return updatedMessages;
            });
        } catch (e) {
            console.error('Failed to parse suggestions:', e);
        }
      }
      
      if(isVoiceMode) {
          speakText(finalAiText);
      }

    } catch (error) {
        console.error("Error streaming message:", error);
        const errorText = "Sorry, I'm having trouble connecting. Please try again later.";
        setMessages(prev => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.sender === MessageSender.AI) {
                lastMessage.text = errorText;
            }
            return updatedMessages;
        });
        if(isVoiceMode) speakText(errorText);
    } finally {
      if (firstChunk) {
        setIsLoading(false);
      }
    }
  }, [messages, isVoiceMode, speakText]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setIsLoading(true);
        setTimeout(() => {
            const welcomeText = "Hello! I'm Ibrahim's AI assistant. Feel free to ask me anything about his professional background.";
            setMessages([{ sender: MessageSender.AI, text: welcomeText }]);
            if(isVoiceMode) speakText(welcomeText);
            setIsLoading(false);
        }, 1000);
    }
  }, [isOpen, isVoiceMode, speakText, messages.length]);

  useEffect(() => {
      // Cleanup speechSynthesis on close
      return () => {
          if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
          }
      }
  }, []);
  
  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        console.warn("Speech Recognition not supported by this browser.");
        return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
        setInput(transcript);
        if (event.results[0].isFinal) {
            handleSendMessage(transcript);
        }
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        const tempError = `Voice error: ${event.error}. Please try again.`;
        setMessages(prev => [...prev, { sender: MessageSender.AI, text: tempError }]);
    };
    
    recognitionRef.current = recognition;

  }, [handleSendMessage]);

  const toggleListen = () => {
    if (isListening) {
        recognitionRef.current?.stop();
    } else {
        setInput(''); // Clear input before starting
        recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };


  useEffect(scrollToBottom, [messages, isLoading]);
  
  const handleCloseChat = () => {
      if (messages.length > 1) {
        setShowConfirmation(true);
      } else {
        setIsOpen(false);
        setMessages([]);
      }
  }
  
  const confirmClose = () => {
      setIsOpen(false);
      setShowConfirmation(false);
      setMessages([]);
      setIsVoiceMode(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
  
  const openChat = (voice = false) => {
      setIsVoiceMode(voice);
      setIsOpen(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
      handleSendMessage(suggestion);
  };

  return (
    <>
        <div className="fixed bottom-6 right-6 z-50 group">
            <div className={`relative flex items-center justify-end transition-all duration-300 ease-in-out w-16 h-16 ${!isOpen && 'group-hover:w-44'}`}>
                <div className="absolute right-0 flex items-center justify-center w-16 h-16 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg cursor-pointer border border-white/10" onClick={() => openChat(isVoiceMode)}>
                     <BotIcon className="w-8 h-8 text-white" />
                </div>
                {!isOpen && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-[4.5rem] gap-2">
                        <button className="flex items-center justify-center w-12 h-12 bg-slate-700/80 backdrop-blur-sm rounded-full shadow-md hover:bg-[#EA2323]/80" title="Text Chat" onClick={() => openChat(false)}>
                            <SendIcon className="w-6 h-6 rotate-[-45deg]" />
                        </button>
                        <button className="flex items-center justify-center w-12 h-12 bg-slate-700/80 backdrop-blur-sm rounded-full shadow-md hover:bg-[#EA2323]/80" title="Voice Chat" onClick={() => openChat(true)}>
                            <MicrophoneIcon className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] glass-card rounded-lg shadow-xl flex flex-col z-40">
           <CrackSVG />
           {showConfirmation && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                    <div className="glass-card p-6 rounded-lg text-center">
                        <h3 className="text-lg font-semibold mb-2">End Session?</h3>
                        <p className="text-sm text-gray-300 mb-4">Your conversation will be lost.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 transition-colors">Continue Chat</button>
                            <button onClick={confirmClose} className="px-4 py-2 rounded bg-[#EA2323] hover:bg-red-500 transition-colors">End Session</button>
                        </div>
                    </div>
                </div>
            )}
          <header className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>Ask me about Ibrahim</span>
                {isSpeaking && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </h2>
            <button onClick={handleCloseChat} className="text-gray-400 hover:text-white">
              <CloseIcon className="w-5 h-5" />
            </button>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto bg-black/20">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === MessageSender.USER ? 'justify-end' : ''}`}>
                  {message.sender === MessageSender.AI && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-300" /></span>}
                  <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${message.sender === MessageSender.USER ? 'bg-[#EA2323] text-white' : 'bg-slate-700/80 text-slate-200'} prose prose-sm prose-invert`}>
                      <ReactMarkdown>{message.text || " "}</ReactMarkdown>
                  </div>
                  {message.sender === MessageSender.USER && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-300" /></span>}
                </div>
              ))}
              {isLoading && (
                  <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-300 animate-pulse" /></span>
                      <div className="p-3 rounded-lg bg-slate-700/80 text-gray-400 flex items-center">
                          <span>AI is thinking...</span>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {suggestions.length > 0 && !isLoading && (
            <div className="p-2 border-t border-white/10">
                <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-1 text-sm bg-slate-700/80 hover:bg-slate-600/80 rounded-full transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            </div>
          )}

          <footer className="p-4 border-t border-white/10">
            { isVoiceMode ? (
                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setIsVoiceMode(false)} className="text-gray-400 hover:text-white" title="Switch to Text Mode"><SendIcon className="w-6 h-6 rotate-[-45deg]" /></button>
                    <button 
                        onClick={toggleListen}
                        disabled={isSpeaking}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-[#EA2323] hover:bg-red-500'} disabled:bg-slate-600 disabled:cursor-not-allowed`}
                    >
                        <MicrophoneIcon className="w-8 h-8 text-white" />
                    </button>
                    <span className="w-6 h-6"></span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 p-2 bg-slate-700/80 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA2323] text-white"
                    disabled={isLoading}
                  />
                   <button onClick={() => setIsVoiceMode(true)} type="button" className="text-gray-400 hover:text-white p-2" title="Switch to Voice Mode">
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                  <button type="submit" disabled={isLoading || !input.trim()} className="bg-[#EA2323] text-white p-2 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-red-500 transition-colors">
                    <SendIcon className="w-5 h-5" />
                  </button>
                </form>
            )}
          </footer>
        </div>
      )}
    </>
  );
};

export default AiChat;