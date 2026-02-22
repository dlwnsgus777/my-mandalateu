import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// ─── Auth 핸들러 참조 (authStore가 초기화 후 등록) ────────────────────────────
// 순환 참조 방지: client.ts는 authStore를 직접 import하지 않음
// authStore → authApi → client (단방향)
interface UserInfo {
  id: number;
  email: string;
  nickname: string;
}

let _getAccessToken: () => string | null = () => null;
let _getRefreshToken: () => string | null = () => null;
let _setTokens: (accessToken: string, refreshToken: string, user: UserInfo) => void = () => {};
let _logout: () => void = () => {};

export const registerAuthHandlers = (handlers: {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (accessToken: string, refreshToken: string, user: UserInfo) => void;
  logout: () => void;
}) => {
  _getAccessToken = handlers.getAccessToken;
  _getRefreshToken = handlers.getRefreshToken;
  _setTokens = handlers.setTokens;
  _logout = handlers.logout;
};

// ─── axios 인스턴스 ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── 요청 인터셉터: accessToken 자동 주입 ────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = _getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── 응답 인터셉터: 401 시 토큰 갱신 후 원래 요청 재시도 ─────────────────────

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 갱신 중인 경우 대기 후 재시도
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = _getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      // 인터셉터 루프 방지: 갱신 요청은 raw axios 사용
      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, { refreshToken });
      _setTokens(data.accessToken, data.refreshToken, data.user);
      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      _logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);