
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { ChatIcon, SendIcon, CloseIcon, BotIcon, UserIcon } from './Icons';
import { Content } from '@google/genai';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I'm your AI study assistant. Ask me anything about your subjects." }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // FIX: Sliced messages to remove the initial greeting from the history sent to the API.
      // The chat history must start with a 'user' message.
      const history: Content[] = messages.slice(1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      const aiResponseText = await getChatbotResponse(history, userInput);
      const aiMessage: Message = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatWindowClass = `
    fixed bottom-24 right-4 md:right-8
    w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[600px]
    bg-slate-800/80 backdrop-blur-2xl border border-white/20
    rounded-2xl shadow-2xl flex flex-col
    transition-all duration-300 ease-in-out
    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`;

  return (
    <>
      <div className={chatWindowClass}>
        <header className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-bold text-lg">AI Study Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/10">
            <CloseIcon />
          </button>
        </header>

        <div ref={chatHistoryRef} className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <span className="flex-shrink-0 p-2 bg-purple-500/20 rounded-full"><BotIcon /></span>}
              <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'ai' ? 'bg-white/10 rounded-tl-none' : 'bg-cyan-600 text-white rounded-br-none'}`}>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
               {msg.sender === 'user' && <span className="flex-shrink-0 p-2 bg-cyan-500/20 rounded-full"><UserIcon /></span>}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 p-2 bg-purple-500/20 rounded-full"><BotIcon /></span>
              <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-white/10 rounded-tl-none">
                <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-0"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="p-3 bg-cyan-500 rounded-lg disabled:opacity-50 transition-colors">
              <SendIcon />
            </button>
          </div>
        </footer>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-8 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full text-white shadow-lg shadow-black/30 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <ChatIcon />
      </button>
    </>
  );
};

export default Chatbot;
