// ============================================
// API 클라이언트 및 에러 타입 (Core)

import { authAPI } from "./auth";
import { contactApi, serverContactApi } from "./contact";
import { faqAPI, serverFaqAPI } from "./faq";
import { mainAPI } from "./main";
import { reservationAPI, serverReservationAPI } from "./reservation";
import { userAPI } from "./user";

// ============================================
export { apiClient, serverApiClient, ApiError } from "./client";

// ============================================
// 도메인별 API 서비스 (Alphabetical Order)
// ============================================
export { authAPI } from "./auth";
export { contactApi, serverContactApi } from "./contact";
export { faqAPI, serverFaqAPI } from "./faq";
export { mainAPI } from "./main";
export { reservationAPI, serverReservationAPI } from "./reservation";
export { userAPI } from "./user";

// ============================================
// 타입 정의 (Type-only exports for better tree-shaking)
// ============================================

// Auth 관련 타입
export type {
  SignUpData,
  LoginData,
  LoginResponse,
  CurrentUserResponse,
  UserProfile,
} from "@/types/auth";

// Contact 관련 타입
export type {
  ContactForm,
  ContactRequest,
  ContactResponse,
  ContactCategory,
  ContactFormErrors,
} from "@/types/contact";

// FAQ 관련 타입
export type { FaqResponse } from "@/types/faq";

// Banner 관련 타입
export type { Banner } from "@/types/banner";

// Reservation 관련 타입 (필요시 추가)
export type { Seat, TimeSlot, PlanType, Coupon } from "@/types/reservation";

// ============================================
// API 서비스 통합 객체 (Optional - 편의성)
// ============================================
export const api = {
  auth: authAPI,
  contact: contactApi,
  faq: faqAPI,
  main: mainAPI,
  reservation: reservationAPI,
  user: userAPI,
} as const;

// 서버 컴포넌트용 API 통합 객체
export const serverApi = {
  contact: serverContactApi,
  faq: serverFaqAPI,
  reservation: serverReservationAPI,
} as const;
