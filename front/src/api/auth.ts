import { apiClient } from './client';

// ─── 요청 타입 ────────────────────────────────────────────────────────────────

export interface GoogleLoginRequest {
  idToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// ─── 응답 타입 ────────────────────────────────────────────────────────────────

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserInfo;
}

// ─── API 함수 ─────────────────────────────────────────────────────────────────

export const authApi = {
  googleLogin: (body: GoogleLoginRequest) =>
    apiClient.post<TokenResponse>('/api/v1/auth/google', body),

  refresh: (body: RefreshRequest) =>
    apiClient.post<TokenResponse>('/api/v1/auth/refresh', body),

  logout: () =>
    apiClient.post('/api/v1/auth/logout'),
};
