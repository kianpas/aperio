// API 클라이언트 및 에러 타입 내보내기
export { apiClient, serverApiClient, ApiError } from "./client";

// 각 도메인별 API 내보내기
export { authAPI } from "./auth";
export { userAPI } from "./user";
export { faqAPI, serverFaqAPI } from "./faq";
export { reservationAPI, serverReservationAPI } from "./reservation";
export { mainAPI } from "./main";

// 타입들도 함께 내보내기 (편의성)
export type {
  SignUpData,
  LoginData,
  LoginResponse,
  CurrentUserResponse,
  UserProfile,
} from "@/types/auth";

export type { FaqResponse } from "@/types/faq";
export type { Banner } from "@/types/banner";
