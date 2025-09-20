import React, { useState, useRef, useEffect, useCallback } from 'react';
import { streamChatMessage } from '../services/geminiService';
import { SendIcon, BotIcon, UserIcon, CloseIcon, MicrophoneIcon } from './icons';
import ReactMarkdown from 'react-markdown';

const CrackSVG = ({style}) => (
    <div className="crack-effect" style={style}>
        <svg viewBox="0 0 200 200" preserveAspectRatio="none">
            <path d="M20 20 L180 180" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="1" />
            <path d="M20 180 L180 20" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="0.5" />
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
      <div className="fixed bottom-4 right-4 z-50 group">
        <div 
          className="relative w-14 h-14 bg-gradient-to-br from-purple-600 via-red-500 to-orange-500 hover:from-purple-700 hover:via-red-600 hover:to-orange-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center transform hover:scale-105 hover:rotate-3"
          onClick={() => setIsOpen(true)}
        >
          {/* AI Brain Icon */}
          <div className="relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
              <path d="M21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9Z" fill="currentColor"/>
              <path d="M7 9C7 10.1 6.1 11 5 11C3.9 11 3 10.1 3 9C3 7.9 3.9 7 5 7C6.1 7 7 7.9 7 9Z" fill="currentColor"/>
              <path d="M12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22Z" fill="currentColor"/>
              <path d="M12 8L5 9L12 12L19 9L12 8Z" fill="currentColor" opacity="0.7"/>
              <path d="M12 12L5 15L12 18L19 15L12 12Z" fill="currentColor" opacity="0.5"/>
            </svg>
            
            {/* Animated dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-red-500 to-orange-500 rounded-2xl blur opacity-30 animate-pulse"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chat with AI about Ibrahim
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] glass-card rounded-lg shadow-xl flex flex-col z-40">
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Start AI Chat?</h3>
            <p className="text-gray-300 text-sm mb-4">This will connect you with an AI assistant to learn more about Ibrahim El Khalil's professional background.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 transition-colors">Continue Chat</button>
              <button onClick={() => { setShowConfirmation(false); setIsOpen(false); }} className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Window */}
      <div className="fixed bottom-4 right-4 w-80 h-[500px] glass-card rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <CrackSVG />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
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
                  ? 'bg-red-500/20 text-red-400' 
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
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-3 h-3 text-white" />
                  ) : (
                    <BotIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-3 py-2 text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-100'
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
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <BotIcon className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white/10 rounded-2xl px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/25 transition-all duration-200"
                disabled={isLoading || isListening}
              />
              {isVoiceMode && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
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
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center"
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