// 계정 관리 관련 타입 정의
export interface SignUpData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// 비밀번호 재설정 관련 타입 (향후 확장)
export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  newPassword: string;
}