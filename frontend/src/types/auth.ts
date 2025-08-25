// 인증 관련 타입 정의
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

export interface LoginResponse {
  email: string;
  name: string;
  authorities: string[];
}

export interface CurrentUserResponse {
  authenticated: boolean;
  user?: User;
}

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  plan: string;
  createdAt: string;
}