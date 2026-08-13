import { create } from 'zustand';

export type AlertModalTone = 'error' | 'success';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  tone: AlertModalTone;
  showAlert: (params: { title: string; message: string; tone?: AlertModalTone }) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>(set => ({
  isOpen: false,
  title: '',
  message: '',
  tone: 'error',
  showAlert: ({ title, message, tone = 'error' }) => set({ isOpen: true, title, message, tone }),
  closeAlert: () => set({ isOpen: false }),
}));
