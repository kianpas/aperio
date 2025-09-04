import { apiClient, ApiError } from "./client";
import type { SignUpData } from "@/types/account";
import type { User, CurrentUserResponse, RegisterUserResponse } from "@/types/auth";

// 계정 관리 API (회원가입, 사용자 정보 관리)
export const accountAPI = {
  // 회원가입
  signUp: async (userData: SignUpData): Promise<RegisterUserResponse> => {
    const res = await apiClient.post<RegisterUserResponse>("/api/v1/accounts/signup", userData);
    
    console.log("signUp response:", res);
    // 백엔드가 HTML 에러 페이지를 200으로 내려보내는 경우 대비
    if (!res || (typeof res === "object" && Object.keys(res).length === 0)) {
      throw new ApiError("서버 응답 형식이 올바르지 않습니다. (회원가입 실패)");
    }
    return res;
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<CurrentUserResponse>("/api/v1/users/me");
      // 백엔드 응답: {authenticated: true, user: {...}}
      if (response.authenticated && response.user) {
        return response.user;
      }
      return null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null; // 미인증 상태
      }
      throw error;
    }
  },

  // 사용자 프로필 수정 (추후 확장)
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return apiClient.put<User>("/api/v1/users/profile", userData);
  },

  // 비밀번호 변경 (추후 확장)
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post("/api/v1/users/change-password", {
      currentPassword,
      newPassword,
    });
  },

  // 회원 탈퇴 (추후 확장)
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete("/api/v1/users/account");
  },
};
