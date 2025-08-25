import { serverApiClient } from './client';
import type { Banner } from '@/types/banner';

export interface MainDataResponse {
  bannerList: Banner[];
  message: string;
}

// 메인 페이지 API (주로 서버 컴포넌트에서 사용)
export const mainAPI = {
  // 서버에서 메인 데이터 조회 (배너 등)
  getMainData: async (): Promise<MainDataResponse> => {
    return serverApiClient.get<MainDataResponse>('/api/v1/main');
  },

  // 배너만 조회
  getBanners: async (): Promise<Banner[]> => {
    const data = await serverApiClient.get<MainDataResponse>('/api/v1/main');
    return data.bannerList || [];
  },
};