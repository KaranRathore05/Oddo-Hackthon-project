import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt: number;
}

interface AiState {
  isOpen: boolean;
  history: Message[];
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  clearHistory: () => void;
}

export const useAiStore = create<AiState>()(
  persist(
    (set) => ({
      isOpen: false,
      history: [],
      
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
      
      addMessage: (message: Message) => set((state) => ({ 
        history: [...state.history, message] 
      })),
      
      updateLastMessage: (content: string) => set((state) => {
        const history = [...state.history];
        if (history.length > 0) {
          history[history.length - 1] = { 
            ...history[history.length - 1], 
            content 
          };
        }
        return { history };
      }),
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'transitops-ai-history',
      partialize: (state) => ({
        history: state.history,
        isOpen: state.isOpen,
      }),
    }
  )
);
