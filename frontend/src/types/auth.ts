// 인증 관련 타입 정의
export interface LoginData {
  email: string;
  password: string;
}

// 세션 기반 인증 상태
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// 백엔드 API 응답 구조
export interface CurrentUserResponse {
  authenticated: boolean;
  user?: User;
}

// 다른 타입 파일에서 import할 기본 User 타입
export interface User {
  email: string;
  name: string;
  phoneNumber?: string;
  plan?: string;
  createdAt?: string;
}

// 회원가입 성공 응답 타입
export interface RegisterUserResponse {
  id: number;
  email: string;
  name: string;
  message: string;
  createdAt: string; // ISO 문자열(백엔드 LocalDateTime 직렬화)
}
