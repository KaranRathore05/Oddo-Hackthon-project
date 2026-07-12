import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Trash2, Paperclip, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAiStore } from '@/store/aiStore';
import { streamChat } from '@/services/aiService';
import { useAuthStore } from '@/store/authStore';

export function AssistantWindow() {
  const { isOpen, setIsOpen, history, addMessage, updateLastMessage, clearHistory } = useAiStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    
    const messageId = Date.now().toString();
    addMessage({
      id: messageId,
      role: 'user',
      content: userMessage,
      createdAt: Date.now()
    });

    const botMessageId = (Date.now() + 1).toString();
    addMessage({
      id: botMessageId,
      role: 'model',
      content: '',
      createdAt: Date.now()
    });

    try {
      const stream = streamChat(userMessage, history);
      let fullText = "";
      let lastUpdate = Date.now();
      
      for await (const chunk of stream) {
        fullText += chunk;
        // Throttle UI updates to max ~30fps to prevent React render lag
        if (Date.now() - lastUpdate > 32) {
          useAiStore.getState().updateLastMessage(fullText);
          lastUpdate = Date.now();
        }
      }
      // Final flush to ensure the complete message is rendered
      useAiStore.getState().updateLastMessage(fullText);
    } catch (error) {
      console.error(error);
      useAiStore.getState().updateLastMessage('Sorry, I encountered an error connecting to the TransitOps network.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-6 right-6 z-50 flex flex-col glass-card border border-white/10 shadow-glass overflow-hidden ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px] max-h-[80vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-charcoal/50 backdrop-blur-md cursor-move">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center border border-cyan/20">
                <Bot className="w-4 h-4 text-cyan" />
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald border border-charcoal" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">TransitOps AI</h3>
              <p className="text-xs text-muted">Role: {user?.role || 'Guest'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <button type="button" onClick={() => clearHistory()} className="p-1.5 text-muted hover:text-white rounded-md hover:bg-white/5 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button type="button" onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-muted hover:text-white rounded-md hover:bg-white/5 transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="p-1.5 text-muted hover:text-white rounded-md hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        {!isMinimized && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <Bot className="w-12 h-12 text-cyan" />
                  <div>
                    <p className="text-white font-medium">How can I help you today?</p>
                    <p className="text-sm text-muted">Ask anything about TransitOps.</p>
                  </div>
                </div>
              ) : (
                history.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user' 
                        ? 'bg-cyan/20 border border-cyan/30 text-white' 
                        : 'bg-white/5 border border-white/10 text-white/90'
                    }`}>
                    <div className="prose prose-invert prose-sm max-w-none [&>p]:m-0 [&>p]:leading-relaxed [&>a]:text-cyan [&>a]:hover:underline [&>pre]:bg-charcoal/80 [&>pre]:rounded-md [&>pre]:p-2 [&>pre]:overflow-x-auto [&>pre]:text-xs [&>pre]:my-2 [&_code]:text-cyan [&_code]:text-xs [&_code]:bg-charcoal/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-charcoal/30">
              <div className="relative flex items-end gap-2 bg-charcoal/50 border border-white/10 rounded-xl p-2 focus-within:border-cyan/50 transition-colors">
                <button type="button" className="p-2 text-muted hover:text-white transition-colors" title="Coming soon">
                  <Paperclip className="w-4 h-4" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about TransitOps..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-muted outline-none resize-none max-h-32 min-h-[24px] py-2"
                  rows={1}
                />
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-cyan text-charcoal rounded-lg hover:bg-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
