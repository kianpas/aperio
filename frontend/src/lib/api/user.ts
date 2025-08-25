const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  plan: string;
  createdAt: string;
}

export const userAPI = {
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/profile`, {
        credentials: "include", // 중요: 세션 쿠키 포함
      });

      if (!response.ok) {
        throw new Error("사용자 정보 조회 실패");
      }

      return response.json();
    } catch (error) {
      console.error("getCurrentUser error:", error);
      throw error;
    }
  },
};
