import { create } from 'zustand';

interface ErrorState {
  isOpen: boolean;
  title: string;
  message: string;
  showError: (params: { title: string; message: string }) => void;
  closeError: () => void;
}

export const useErrorStore = create<ErrorState>(set => ({
  isOpen: false,
  title: '',
  message: '',
  showError: ({ title, message }) => set({ isOpen: true, title, message }),
  closeError: () => set({ isOpen: false }),
}));
