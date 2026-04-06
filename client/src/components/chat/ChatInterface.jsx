import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';
import StreamingText from './StreamingText';

export default function ChatInterface({
  onQuery,
  toolCalls = [],
  isLoading = false,
  error = null,
  currentQuery = '',
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolCalls, isLoading]);

  // When a new query comes in from outside (e.g. DrugSearchBar on Search page),
  // add it as a user message so the chat reflects it.
  useEffect(() => {
    if (currentQuery) {
      setMessages(prev => {
        const alreadyPresent = prev.some(m => m.role === 'user' && m.content === currentQuery);
        if (alreadyPresent) return prev;
        return [...prev, { role: 'user', content: currentQuery }];
      });
    }
  }, [currentQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputText('');
    onQuery(text);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-primary-600 text-white flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">SpecialtyRx Assistant</p>
          <p className="text-xs text-primary-100">AI-powered prescribing guidance</p>
        </div>
        {isLoading && (
          <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full animate-pulse">
            Researching…
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8 text-slate-400">
            <Bot className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">Ask about any specialty drug</p>
            <p className="text-xs mt-1">e.g. "How do I prescribe Ocrevus?" or "REMS requirements for Accutane"</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}

        {/* Streaming status shown inline */}
        {(isLoading || error) && (
          <div className="pl-9">
            <StreamingText toolCalls={toolCalls} isLoading={isLoading} error={error} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t border-slate-200 bg-white"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask a follow-up question..."
          disabled={isLoading}
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 focus:border-accent-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-9 h-9 rounded-lg bg-accent-500 text-white flex items-center justify-center hover:bg-accent-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
