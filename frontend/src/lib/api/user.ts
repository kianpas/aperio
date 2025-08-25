import { apiClient } from './client';
import type { UserProfile } from '@/types/auth';

export const userAPI = {
  // 사용자 프로필 조회
  getUserProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/api/v1/users/me/profile');
  },

  // 사용자 프로필 업데이트
  updateUserProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.put<UserProfile>('/api/v1/users/me/profile', profileData);
  },

  // 비밀번호 변경
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    return apiClient.post('/api/v1/users/me/change-password', passwordData);
  },

  // 계정 삭제
  deleteAccount: async () => {
    return apiClient.delete('/api/v1/users/me');
  },
};
