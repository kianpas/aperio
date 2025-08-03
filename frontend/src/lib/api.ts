const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface SignUpData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export const authAPI = {
  signUp: async (userData: SignUpData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Content-Type 확인
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        // JSON이 아닌 응답 (HTML 등)인 경우
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
};
