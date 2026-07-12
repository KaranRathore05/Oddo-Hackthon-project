import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useAiStore } from '@/store/aiStore';
import { cn } from '@/lib/utils';

export function AssistantLauncher() {
  const { isOpen, setIsOpen } = useAiStore();

  if (isOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(true)}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-14 h-14 rounded-full",
        "bg-charcoal border border-white/10",
        "shadow-glass glass-card",
        "flex items-center justify-center cursor-pointer",
        "group"
      )}
    >
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-cyan/30 blur-md pointer-events-none"
      />
      <Bot className="w-6 h-6 text-cyan group-hover:text-white transition-colors relative z-10" />
    </motion.button>
  );
}
