const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface SignUpData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  email: string;
  name: string;
}

// 백엔드 로그인 응답 구조에 맞게 수정
export interface LoginResponse {
  email: string;
  name: string;
  authorities: string[];
}

// 현재 사용자 정보 응답 구조
export interface CurrentUserResponse {
  authenticated: boolean;
  user?: User;
}

export const authAPI = {
  signUp: async (userData: SignUpData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          `서버에서 올바르지 않은 응답을 받았습니다. Status: ${response.status}`
        );
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다");
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
        );
      }
      throw error;
    }
  },

  // 백엔드 LoginUserResponse 구조에 맞게 수정
  login: async (loginData: LoginData): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      return data; // LoginUserResponse 직접 반환
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
        );
      }
      throw error;
    }
  },

  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        credentials: "include", // 중요: 세션 쿠키 포함
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { authenticated: false };
        }
        throw new Error("사용자 정보 조회 실패");
      }

      return response.json();
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return { authenticated: false };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include", // 중요: 세션 쿠키 포함
      });
    } catch (error) {
      console.error("Logout error:", error);
      // 로그아웃은 실패해도 클라이언트 상태는 초기화
    }
  },
};
