import { apiClient } from './client';

// ─── 요청 타입 ────────────────────────────────────────────────────────────────

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// ─── 응답 타입 ────────────────────────────────────────────────────────────────

export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// ─── API 함수 ─────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (body: SignupRequest) =>
    apiClient.post<SignupResponse>('/api/v1/auth/signup', body),

  login: (body: LoginRequest) =>
    apiClient.post<TokenResponse>('/api/v1/auth/login', body),

  refresh: (body: RefreshRequest) =>
    apiClient.post<TokenResponse>('/api/v1/auth/refresh', body),
};