import { apiClient, serverApiClient } from './client';
import type { FaqResponse } from '@/types/faq';

export const faqAPI = {
  // 모든 FAQ 조회 (클라이언트)
  getFaqs: async (): Promise<FaqResponse[]> => {
    return apiClient.get<FaqResponse[]>('/api/v1/faqs');
  },

  // 특정 카테고리의 FAQ 조회 (클라이언트)
  getFaqsByCategory: async (category: string): Promise<FaqResponse[]> => {
    return apiClient.get<FaqResponse[]>(`/api/v1/faqs/category/${encodeURIComponent(category)}`);
  },

  // 카테고리 목록 조회 (클라이언트)
  getCategories: async (): Promise<string[]> => {
    return apiClient.get<string[]>('/api/v1/faqs/categories');
  },
};

// 서버 컴포넌트용 FAQ API
export const serverFaqAPI = {
  // 서버에서 FAQ 조회 (SSR/SSG용)
  getFaqs: async (): Promise<FaqResponse[]> => {
    return serverApiClient.get<FaqResponse[]>('/api/v1/faqs');
  },

  // 서버에서 카테고리별 FAQ 조회
  getFaqsByCategory: async (category: string): Promise<FaqResponse[]> => {
    return serverApiClient.get<FaqResponse[]>(`/api/v1/faqs/category/${encodeURIComponent(category)}`);
  },

  // 서버에서 카테고리 목록 조회
  getCategories: async (): Promise<string[]> => {
    return serverApiClient.get<string[]>('/api/v1/faqs/categories');
  },
};
