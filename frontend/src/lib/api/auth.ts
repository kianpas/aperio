import { apiClient } from "./client";
import type {
  SignUpData,
  LoginData,
  LoginResponse,
  CurrentUserResponse,
  User,
} from "@/types/auth";

export const authAPI = {
  // 회원가입
  signUp: async (userData: SignUpData) => {
    return apiClient.post("/api/v1/auth/signup", userData);
  },

  // 로그인
  login: async (loginData: LoginData): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/api/v1/auth/login", loginData);
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    try {
      const user = await apiClient.get<User>("/api/v1/users/me");
      return { authenticated: true, user };
    } catch (error) {
      // 401 에러인 경우 인증되지 않은 상태로 처리
      return { authenticated: false };
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } catch (error) {
      // 로그아웃은 실패해도 클라이언트 상태 초기화
      console.warn("Logout request failed, but proceeding with client cleanup");
    }
  },
};
