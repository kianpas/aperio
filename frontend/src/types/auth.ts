//인증 타입 정의
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
  phoneNumber?: string;
  plan?: string;
  createdAt?: string;
}

export interface CurrentUserResponse {
  authenticated: boolean;
  user?: User;
}

// 세션 기반 인증 상태
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}