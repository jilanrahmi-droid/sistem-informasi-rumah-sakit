import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, ShieldCheck, Database } from 'lucide-react';
import { ChatMessage, AgentType } from '../types';
import { sendMessageToAgent } from '../services/geminiService';

interface ChatInterfaceProps {
  initialMessage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage) {
        setMessages([{
            id: 'init',
            role: 'model',
            text: initialMessage,
            agent: AgentType.COORDINATOR,
            timestamp: new Date()
        }])
    }
  }, [initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAgent(userMsg.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        agent: response.agent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getAgentColor = (agent?: AgentType) => {
    switch (agent) {
      case AgentType.PATIENT_MANAGER: return 'bg-teal-100 text-teal-800 border-teal-200';
      case AgentType.MEDICAL_ASSISTANT: return 'bg-rose-100 text-rose-800 border-rose-200';
      case AgentType.DOC_CREATOR: return 'bg-amber-100 text-amber-800 border-amber-200';
      case AgentType.ADMIN_HANDLER: return 'bg-slate-200 text-slate-800 border-slate-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
            <h3 className="font-semibold text-slate-800">Layanan Agen Cerdas</h3>
            <p className="text-xs text-slate-500">Ditenagai oleh Koordinator Pusat & Sub-Agen Spesialis</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
            <ShieldCheck size={14} />
            <span>Privasi Data Aktif</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-none'
            }`}>
              {msg.role === 'model' && (
                <div className={`text-xs font-bold mb-1 px-2 py-0.5 rounded-full w-fit border ${getAgentColor(msg.agent)}`}>
                  {msg.agent || AgentType.COORDINATOR}
                </div>
              )}
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {msg.text}
              </div>
              <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" size={18} />
              <span className="text-sm text-slate-500">Koordinator sedang merutekan permintaan...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ketik permintaan Anda (misal: 'Jadwalkan pasien Budi', 'Cek pendapatan', 'Gejala demam berdarah')..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-[52px] scrollbar-hide"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          AI dapat membuat kesalahan. Jangan masukkan data medis sensitif (PII) yang sebenarnya.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;