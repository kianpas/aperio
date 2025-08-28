import { apiClient, serverApiClient } from './client';
import type { ContactRequest, ContactResponse } from '@/types/contact';

// 클라이언트 컴포넌트용 Contact API
export const contactApi = {
  // 문의 전송 (클라이언트에서만 사용)
  submitContact: async (data: ContactRequest): Promise<ContactResponse> => {
    return apiClient.post<ContactResponse>('/api/v1/contact', data);
  },

  // 문의 내역 조회 (로그인한 사용자)
  getMyContacts: async () => {
    return apiClient.get('/api/v1/contact/my');
  },

  // 특정 문의 상세 조회
  getContactDetail: async (contactId: string) => {
    return apiClient.get(`/api/v1/contact/${contactId}`);
  },
};

// 서버 컴포넌트용 Contact API (필요시)
export const serverContactApi = {
  // 관리자용 문의 목록 조회 (SSR)
  getAllContacts: async () => {
    return serverApiClient.get('/admin/contacts');
  },

  // 특정 문의 상세 조회 (SSR)
  getContactDetail: async (contactId: string) => {
    return serverApiClient.get(`/admin/contacts/${contactId}`);
  },
};