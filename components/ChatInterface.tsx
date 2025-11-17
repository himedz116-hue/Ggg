import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { PdfIcon } from './icons/PdfIcon';
import { SendIcon } from './icons/SendIcon';
import MessageComponent from './Message';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  fileNames: string[];
  onReset: () => void;
  onGetGeneralAnswer: (question: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, fileNames, onReset, onGetGeneralAnswer }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <header className="flex items-center justify-between p-4 border-b border-slate-700 shadow-md flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <PdfIcon className="w-8 h-8 text-indigo-400 flex-shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <h2 className="font-semibold text-lg truncate text-slate-200" title={fileNames.join(', ')}>
              {`${fileNames.length} ${fileNames.length > 2 ? 'ملفات' : 'ملف'} قيد التحليل`}
            </h2>
            <p className="text-sm text-slate-400 truncate" title={fileNames.join(', ')}>
                {fileNames.join(', ')}
            </p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors duration-200 flex-shrink-0"
        >
          ملفات جديدة
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <MessageComponent 
            key={index} 
            message={msg}
            previousMessage={index > 0 ? messages[index - 1] : undefined}
            onGetGeneralAnswer={onGetGeneralAnswer}
            isLoading={isLoading}
          />
        ))}
        {isLoading && messages[messages.length-1]?.sender === 'user' && (
          <div className="flex justify-start items-end gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div className="bg-slate-700 rounded-lg p-3 max-w-md">
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="اسأل أي شيء عن الملفات..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-200 placeholder-slate-400"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            title="إرسال"
            className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
