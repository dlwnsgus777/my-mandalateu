import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, UserInfo } from '../api/auth';
import { userApi } from '../api/user';
import { registerAuthHandlers } from '../api/client';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string, user: UserInfo) => void;
  updateNickname: (nickname: string) => Promise<void>;
}

// ─── 내부 헬퍼 ────────────────────────────────────────────────────────────────

const clearAuthState = () => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
});

// ─── 스토어 ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      loginWithGoogle: async (idToken: string) => {
        const { data } = await authApi.googleLogin({ idToken });
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          // 서버 요청 실패해도 클라이언트 상태는 반드시 초기화
          set(clearAuthState());
        }
      },

      setTokens: (accessToken, refreshToken, user) => {
        set({ accessToken, refreshToken, user, isAuthenticated: true });
      },

      updateNickname: async (nickname: string) => {
        const { data } = await userApi.updateNickname({ nickname });
        set({ user: data });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ─── apiClient 인터셉터에 Auth 핸들러 등록 ────────────────────────────────────
// 앱 시작 시 이 파일이 import되는 순간 등록됨

registerAuthHandlers({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (a, r, u) => useAuthStore.getState().setTokens(a, r, u),
  logout: () => useAuthStore.getState().logout(),
});
