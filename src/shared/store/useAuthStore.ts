import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
