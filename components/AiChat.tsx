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


const PatternSVG: React.FC<{style?: React.CSSProperties}> = ({style}) => (
    <div className="absolute inset-0 overflow-hidden rounded-lg opacity-30" style={style}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Circuit board pattern */}
            <defs>
                <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 20h40M20 0v40" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5" fill="none"/>
                    <circle cx="20" cy="20" r="2" fill="rgba(59, 130, 246, 0.5)"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
            {/* Flowing lines */}
            <path d="M0 100 Q100 50 200 100 T400 100" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" fill="none">
                <animate attributeName="stroke-dasharray" values="0 200;200 200;400 0" dur="3s" repeatCount="indefinite"/>
            </path>
            <path d="M0 200 Q100 150 200 200 T400 200" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.8" fill="none">
                <animate attributeName="stroke-dasharray" values="400 0;200 200;0 400" dur="4s" repeatCount="indefinite"/>
            </path>
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
                <div className="absolute right-0 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-sm rounded-full shadow-lg cursor-pointer border border-blue-400/30 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25 hover:shadow-2xl" onClick={() => openChat(isVoiceMode)}>
                     <BotIcon className="w-8 h-8 text-white drop-shadow-sm" />
                     <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                </div>
                {!isOpen && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-[4.5rem] gap-2">
                        <button className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 backdrop-blur-sm rounded-full shadow-md hover:from-emerald-500 hover:to-emerald-600 border border-emerald-400/30 transition-all duration-200 hover:scale-105" title="Text Chat" onClick={() => openChat(false)}>
                            <SendIcon className="w-6 h-6 rotate-[-45deg] text-white" />
                        </button>
                        <button className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 backdrop-blur-sm rounded-full shadow-md hover:from-purple-500 hover:to-purple-600 border border-purple-400/30 transition-all duration-200 hover:scale-105" title="Voice Chat" onClick={() => openChat(true)}>
                            <MicrophoneIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>
                )}
            </div>
        </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] glass-card rounded-lg shadow-xl flex flex-col z-40 relative">
           <PatternSVG />
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
          <header className="p-4 border-b border-blue-400/20 flex justify-between items-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 relative z-10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BotIcon className="w-5 h-5 text-blue-400" />
                <span>Ask me about Ibrahim</span>
                {isSpeaking && <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>}
            </h2>
            <button onClick={handleCloseChat} className="text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-1">
              <CloseIcon className="w-5 h-5" />
            </button>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto bg-black/20 backdrop-blur-sm relative z-10">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === MessageSender.USER ? 'justify-end' : ''}`}>
                  {message.sender === MessageSender.AI && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center border border-blue-400/30"><BotIcon className="w-5 h-5 text-white" /></span>}
                  <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${message.sender === MessageSender.USER ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border border-emerald-400/30' : 'bg-slate-700/90 text-slate-200 border border-slate-500/30'} prose prose-sm prose-invert shadow-lg`}>
                      <ReactMarkdown>{message.text || " "}</ReactMarkdown>
                  </div>
                  {message.sender === MessageSender.USER && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center border border-emerald-400/30"><UserIcon className="w-5 h-5 text-white" /></span>}
                </div>
              ))}
              {isLoading && (
                  <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center border border-blue-400/30"><BotIcon className="w-5 h-5 text-white animate-pulse" /></span>
                      <div className="p-3 rounded-lg bg-slate-700/90 text-gray-400 flex items-center border border-slate-500/30 shadow-lg">
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

          <footer className="p-4 border-t border-blue-400/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 relative z-10">
            { isVoiceMode ? (
                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setIsVoiceMode(false)} className="text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-full p-2" title="Switch to Text Mode"><SendIcon className="w-6 h-6 rotate-[-45deg]" /></button>
                    <button 
                        onClick={toggleListen}
                        disabled={isSpeaking}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${isListening ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-red-500/30 shadow-2xl' : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600'} disabled:bg-slate-600 disabled:cursor-not-allowed border border-purple-400/30`}
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
                    className="flex-1 p-2 bg-slate-700/90 border border-slate-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-white placeholder-gray-400 transition-colors duration-200"
                    disabled={isLoading}
                  />
                   <button onClick={() => setIsVoiceMode(true)} type="button" className="text-gray-400 hover:text-white p-2 transition-colors duration-200 hover:bg-white/10 rounded-full" title="Switch to Voice Mode">
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                  <button type="submit" disabled={isLoading || !input.trim()} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-2 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 border border-blue-400/30">
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