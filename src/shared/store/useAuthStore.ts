import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { useAutoLoginStore } from '@/shared/store/useAutoLoginStore';

interface AuthState {
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  accessTokenExpiresAt: number | null;
  /** 비동기 갱신 결과가 다른 로그인 세션을 덮지 않게 하는 런타임 세대 값 */
  sessionVersion: number;
  setSession: (session: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresIn?: number;
    userId: string;
  }) => void;
  updateTokens: (
    tokens: {
      accessToken: string;
      idToken: string;
      expiresIn?: number;
    },
    expected: { sessionVersion: number; refreshToken: string },
  ) => boolean;
  clearSession: () => void;
}

type PersistedAuthState = Pick<
  AuthState,
  | 'accessToken'
  | 'refreshToken'
  | 'userId'
  | 'accessTokenExpiresAt'
  | 'sessionVersion'
>;

const getExpiresAt = (expiresIn?: number): number | null =>
  typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0
    ? Date.now() + expiresIn * 1000
    : null;

/**
 * 마이페이지 "자동 로그인 유지" 설정에 따라 세션 저장소를 고른다.
 * 켜져 있으면 localStorage(브라우저를 껐다 켜도 유지), 꺼져 있으면
 * sessionStorage(탭·브라우저를 닫으면 소멸)를 사용한다.
 */
const authStorage: StateStorage = {
  getItem: name => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    if (useAutoLoginStore.getState().autoLogin) {
      sessionStorage.removeItem(name);
      localStorage.setItem(name, value);
    } else {
      localStorage.removeItem(name);
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: name => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], PersistedAuthState>(
    set => ({
      accessToken: null,
      idToken: null,
      refreshToken: null,
      userId: null,
      accessTokenExpiresAt: null,
      sessionVersion: 0,
      setSession: session =>
        set(state => ({
          accessToken: session.accessToken,
          idToken: session.idToken,
          refreshToken: session.refreshToken,
          userId: session.userId,
          accessTokenExpiresAt: getExpiresAt(session.expiresIn),
          sessionVersion: state.sessionVersion + 1,
        })),
      updateTokens: (tokens, expected) => {
        let updated = false;

        set(state => {
          if (
            state.sessionVersion !== expected.sessionVersion ||
            state.refreshToken !== expected.refreshToken
          ) {
            return state;
          }

          updated = true;
          return {
            accessToken: tokens.accessToken,
            idToken: tokens.idToken,
            accessTokenExpiresAt: getExpiresAt(tokens.expiresIn),
          };
        });

        return updated;
      },
      clearSession: () =>
        set(state => ({
          accessToken: null,
          idToken: null,
          refreshToken: null,
          userId: null,
          accessTokenExpiresAt: null,
          sessionVersion: state.sessionVersion + 1,
        })),
    }),
    {
      name: 'gachi-salim-auth',
      version: 1,
      storage: createJSONStorage(() => authStorage),
      // refresh token은 백엔드가 JSON으로 반환하므로 세션 유지에 필요한 값만 저장합니다.
      // 사용하지 않는 ID token은 localStorage에 남기지 않습니다.
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
        sessionVersion: state.sessionVersion,
      }),
      migrate: persistedState => {
        const state = persistedState as Partial<PersistedAuthState>;
        return {
          accessToken: typeof state.accessToken === 'string' ? state.accessToken : null,
          refreshToken: typeof state.refreshToken === 'string' ? state.refreshToken : null,
          userId: typeof state.userId === 'string' ? state.userId : null,
          accessTokenExpiresAt:
            typeof state.accessTokenExpiresAt === 'number' &&
            Number.isFinite(state.accessTokenExpiresAt)
              ? state.accessTokenExpiresAt
              : null,
          sessionVersion:
            typeof state.sessionVersion === 'number' && Number.isFinite(state.sessionVersion)
              ? state.sessionVersion
              : 0,
        };
      },
    },
  ),
);

// "자동 로그인 유지"를 껐다 켜면, 이미 로그인된 세션도 즉시 올바른 저장소(로컬/세션)로 옮겨쓴다.
useAutoLoginStore.subscribe(() => {
  useAuthStore.setState(state => ({ ...state }));
});
