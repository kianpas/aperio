import { FaqResponse } from '@/types/faq';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const faqAPI = {
  // 모든 FAQ 조회 (플랫 구조)
  getFaqs: async (): Promise<FaqResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/faqs`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("FAQ 목록 조회 실패");
    }

    return response.json();
  },

  // 특정 카테고리의 FAQ 조회
  getFaqsByCategory: async (category: string): Promise<FaqResponse[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/faqs/category/${encodeURIComponent(category)}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("카테고리별 FAQ 조회 실패");
    }

    return response.json();
  },

  // 카테고리 목록 조회
  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/faqs/categories`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("FAQ 카테고리 조회 실패");
    }

    return response.json();
  },
};
