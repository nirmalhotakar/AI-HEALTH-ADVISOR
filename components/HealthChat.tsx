import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Trash, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { getHealthChatResponse } from '../services/geminiService';

const STORAGE_KEY = 'healthPredictor_chat';
const EXPIRY_HOURS = 24;

const HealthChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat from local storage
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.length > 0) {
            const lastMsgTime = parsed[parsed.length - 1].timestamp;
            const now = Date.now();
            if ((now - lastMsgTime) < (EXPIRY_HOURS * 60 * 60 * 1000)) {
                setMessages(parsed);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getHealthChatResponse(messages, input);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const clearChat = () => {
    if(confirm("Are you sure you want to clear your chat history?")) {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-100 p-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-slate-900">AI Health Assistant</h2>
                    <p className="text-xs text-slate-500">History clears in 24h • Always verified by AI</p>
                </div>
            </div>
            <button 
                onClick={clearChat} 
                className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" 
                title="Clear Chat"
            >
                <Trash className="w-5 h-5" />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                    <div className="bg-indigo-50 p-6 rounded-full mb-4">
                        <Bot className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">How can I help you today?</h3>
                    <p className="text-slate-500 max-w-sm">Ask about symptoms, medication interactions, healthy diets, or general wellness advice.</p>
                </div>
            )}
            
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                    <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100 ml-3' : 'bg-indigo-100 mr-3'}`}>
                             {msg.role === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                        </div>
                        
                        <div className={`rounded-2xl p-4 shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                        }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <span className={`text-[10px] block mt-2 opacity-70 ${msg.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
            
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="flex items-end">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 mr-3 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                             <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your health question here..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full pl-6 pr-14 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-inner"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md hover:shadow-lg transform active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    </div>
  );
};

export default HealthChat;