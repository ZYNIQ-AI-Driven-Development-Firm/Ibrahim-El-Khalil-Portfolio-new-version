import React, { useState, useRef, useEffect, useCallback } from 'react';
import { streamChatMessage } from '../services/geminiService';
import { SendIcon, BotIcon, UserIcon, CloseIcon, MicrophoneIcon } from './icons';
import ReactMarkdown from 'react-markdown';

const PatternSVG = ({style}) => (
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

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Voice state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Track AI chat session analytics
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      import('../services/apiService').then(({ trackEvent }) => {
        trackEvent('ai_chat');
      });
    }
  }, [isOpen, messages.length]);

  // open chat from external buttons (dashboard)
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('openAiChat', handler);
    return () => window.removeEventListener('openAiChat', handler);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech Synthesis not supported.");
        return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("Speech Recognition not supported.");
      return;
    }
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
        
      setInput(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const handleVoiceToggle = useCallback(() => {
    setIsVoiceMode(!isVoiceMode);
    if (isListening) {
      stopListening();
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isVoiceMode, isListening, isSpeaking, stopListening]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedSuggestions = [
    "Tell me about Ibrahim's experience",
    "What technologies does he work with?",
    "What are his key projects?",
    "How can I contact Ibrahim?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setSuggestions([]);

    try {
      const aiMessage = {
        id: Date.now() + 1,
        text: '',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      let fullResponse = '';
      await streamChatMessage(userMessage.text, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, text: fullResponse }
            : msg
        ));
      });

      if (isVoiceMode && fullResponse) {
        speakText(fullResponse);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    if (value.trim()) {
      const filtered = predefinedSuggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-0 z-50 group">
        <div 
          className="relative w-12 h-28 bg-black/20 backdrop-blur-md hover:bg-black/30 border border-white/20 hover:border-white/30 rounded-l-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 overflow-hidden"
          onClick={() => setIsOpen(true)}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
          
          {/* Bot Icon and Vertical Text */}
          <div className="relative flex flex-col items-center gap-2 z-10">
            <BotIcon className="w-5 h-5 text-white/80 group-hover:text-white drop-shadow-sm transition-colors" />
            <span 
              className="text-white/70 group-hover:text-white font-medium drop-shadow-sm text-[10px] tracking-widest transition-colors"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              CHAT
            </span>
          </div>

          {/* Subtle glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-1/2 translate-y-1/2 right-full mr-2 bg-black/90 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg border border-white/10">
          Chat with AI
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed bottom-24 right-2 w-[calc(100vw-1rem)] sm:w-full max-w-md h-[70vh] max-h-[600px] glass-card rounded-lg shadow-xl flex flex-col z-40">
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Start AI Chat?</h3>
            <p className="text-gray-300 text-sm mb-4">This will connect you with an AI assistant to learn more about Ibrahim El Khalil's professional background.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 transition-colors">Continue Chat</button>
              <button onClick={() => { setShowConfirmation(false); setIsOpen(false); }} className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-500 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Window */}
      <div className="fixed bottom-4 right-2 w-[calc(100vw-1rem)] sm:w-80 h-[500px] glass-card rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <PatternSVG />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-blue-400/20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center border border-blue-400/30">
              <BotIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white">AI Assistant</h3>
              <p className="text-xs text-gray-300">Ask me about Ibrahim</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleVoiceToggle}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isVoiceMode 
                  ? 'bg-purple-500/30 text-purple-400 border border-purple-400/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Toggle voice mode"
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors duration-200"
              aria-label="Close chat"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <BotIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300 text-sm mb-4">Hi! I'm Ibrahim's AI assistant. Ask me anything about his experience, skills, or projects!</p>
              <div className="space-y-2">
                {predefinedSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left p-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-400/30' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400/30'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-3 h-3 text-white" />
                  ) : (
                    <BotIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-3 py-2 text-sm shadow-lg border ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-400/30'
                    : 'bg-slate-700/90 text-slate-200 border-slate-500/30'
                }`}>
                  {message.sender === 'ai' ? (
                    <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center border border-blue-400/30">
                  <BotIcon className="w-3 h-3 text-white animate-pulse" />
                </div>
                <div className="bg-slate-700/90 rounded-2xl px-3 py-2 shadow-lg border border-slate-500/30">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="relative z-10 px-4 pb-2">
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left p-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="relative z-10 p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={isListening ? "Listening..." : "Ask me anything about Ibrahim..."}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all duration-200"
                disabled={isLoading || isListening}
              />
              {isVoiceMode && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 ${
                    isListening 
                      ? 'bg-primary-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  disabled={isLoading}
                >
                  <MicrophoneIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isListening}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AiChat;
