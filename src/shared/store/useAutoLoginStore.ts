import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AutoLoginState {
  autoLogin: boolean;
  setAutoLogin: (autoLogin: boolean) => void;
}

/** 로그인 세션 저장 위치(로컬/세션 스토리지)를 결정하는 기기별 설정. 로그인 여부와 무관하게 항상 유지된다. */
export const useAutoLoginStore = create<AutoLoginState>()(
  persist(
    set => ({
      autoLogin: true,
      setAutoLogin: autoLogin => set({ autoLogin }),
    }),
    { name: 'gachi-salim-auto-login' },
  ),
);
