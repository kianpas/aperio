// API 모듈 통합 export
export { authAPI } from "./auth";
export { accountAPI } from "./account";
export { apiClient, serverApiClient, ApiError } from "./client";

// 편의를 위한 통합 객체 (기존 코드 호환성)
export const api = {
  auth: () => import("./auth").then(m => m.authAPI),
  account: () => import("./account").then(m => m.accountAPI),
};