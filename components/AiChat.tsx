import React, { useState, useRef, useEffect } from 'react';
import { streamChatMessage } from '../services/geminiService';
import { ChatMessage, MessageSender } from '../types';
import { SendIcon, BotIcon, UserIcon, CloseIcon, MicrophoneIcon } from './icons';
import { Content } from '@google/genai';
import ReactMarkdown from 'react-markdown';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setIsLoading(true);
        setTimeout(() => {
            setMessages([{ sender: MessageSender.AI, text: "Hello! I'm Ibrahim's AI assistant. Feel free to ask me anything about his professional background." }]);
            setIsLoading(false);
        }, 1000);
    }
  }, [isOpen]);

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
  }

  const handleSendMessage = async (messageText: string) => {
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

      if (aiResponseText.includes('[SUGGESTIONS]')) {
        const parts = aiResponseText.split('[SUGGESTIONS]');
        const mainText = parts[0].trim();
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
    } catch (error) {
        console.error("Error streaming message:", error);
        setMessages(prev => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.sender === MessageSender.AI) {
                lastMessage.text = "Sorry, I'm having trouble connecting. Please try again later.";
            }
            return updatedMessages;
        });
    } finally {
      if (firstChunk) {
        setIsLoading(false);
      }
    }
  };
  
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
            <div className={`relative flex items-center justify-end transition-all duration-300 ease-in-out w-16 h-16 group-hover:w-44`}>
                <div className="absolute right-0 flex items-center justify-center w-16 h-16 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg cursor-pointer border border-white/10" onClick={() => setIsOpen(!isOpen)}>
                     <BotIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-[4.5rem] gap-2">
                    <button className="flex items-center justify-center w-12 h-12 bg-slate-700/80 backdrop-blur-sm rounded-full shadow-md hover:bg-[#EA2323]/80" title="Text Chat" onClick={() => setIsOpen(true)}>
                        <SendIcon className="w-6 h-6" />
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 bg-slate-700/80 backdrop-blur-sm rounded-full shadow-md hover:bg-[#EA2323]/80" title="Voice Chat (Coming Soon)">
                        <MicrophoneIcon className="w-6 h-6" />
                    </button>
                </div>
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
            <h2 className="text-lg font-semibold text-white">Ask me about Ibrahim</h2>
            <button onClick={handleCloseChat} className="text-gray-400 hover:text-white">
              <CloseIcon className="w-5 h-5" />
            </button>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto bg-black/20">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === MessageSender.USER ? 'justify-end' : ''}`}>
                  {message.sender === MessageSender.AI && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-300" /></span>}
                  <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${message.sender === MessageSender.USER ? 'bg-[#EA2323] text-white' : 'bg-slate-700/80 text-slate-200'}`}>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{message.text || " "}</ReactMarkdown>
                    </div>
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
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 p-2 bg-slate-700/80 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA2323] text-white"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="bg-[#EA2323] text-white p-2 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-red-500 transition-colors">
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </footer>
        </div>
      )}
    </>
  );
};

export default AiChat;
