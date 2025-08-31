// 사용자 정보 관리 관련 타입 정의
import type { User } from "./auth";

// 사용자 프로필 (상세 정보)
export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  plan: string;
  createdAt: string;
}

// 프로필 수정 요청 데이터
export interface ProfileUpdateData {
  name?: string;
  phoneNumber?: string;
}

// 비밀번호 변경 요청 데이터
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// 사용자 상태 관리
export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// 기본 User 타입 재export (편의성)
export type { User };