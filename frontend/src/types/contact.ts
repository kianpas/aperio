// 문의 폼 데이터 타입
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: ContactCategory;
  message: string;
}

// 문의 유형
export type ContactCategory = 
  | "general"      // 일반 문의
  | "reservation"  // 예약 관련
  | "payment"      // 결제 문의
  | "technical"    // 기술 지원
  | "partnership" // 제휴 문의
  | "complaint";   // 불만 신고

// 폼 검증 에러 타입
export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// 문의 상태
export interface ContactState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: ContactFormErrors;
}

// API 요청/응답 타입
export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: ContactCategory;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId?: string;
}

// 연락처 정보 타입
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  businessHours: {
    weekday: string;
    weekend: string;
  };
}