import { apiClient } from "./client";
import type { LoginData, User } from "@/types/auth";

// 인증 관련 API (로그인, 로그아웃)
export const authAPI = {
  // 로그인 - 세션 기반이므로 사용자 정보만 반환
  login: async (loginData: LoginData): Promise<User> => {
    return apiClient.post<User>("/api/v1/auth/login", loginData);
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } catch (error) {
      // 403 에러가 발생해도 클라이언트 측에서는 로그아웃 처리
      console.warn("로그아웃 요청 실패, 클라이언트 상태만 초기화:", error);
    }
  },
};
