import { create } from 'zustand';

interface SuccessState {
  isOpen: boolean;
  title: string;
  message: string;
  showSuccess: (params: { title: string; message: string }) => void;
  closeSuccess: () => void;
}

export const useSuccessStore = create<SuccessState>(set => ({
  isOpen: false,
  title: '',
  message: '',
  showSuccess: ({ title, message }) => set({ isOpen: true, title, message }),
  closeSuccess: () => set({ isOpen: false }),
}));
