import { apiClient } from './client';
import { UserInfo } from './auth';

export interface UpdateNicknameRequest {
  nickname: string;
}

export const userApi = {
  updateNickname: (body: UpdateNicknameRequest) =>
    apiClient.patch<UserInfo>('/api/v1/users/me', body),
};
