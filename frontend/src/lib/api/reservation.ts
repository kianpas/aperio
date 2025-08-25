import { apiClient, serverApiClient } from './client';

// 예약 관련 타입들은 별도 파일로 분리 예정
export interface Seat {
  id: number;
  name: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance';
  price: number;
}

export interface Reservation {
  id: number;
  seatId: number;
  userId: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface CreateReservationData {
  seatId: number;
  startTime: string;
  endTime: string;
}

export const reservationAPI = {
  // 좌석 목록 조회
  getSeats: async (): Promise<Seat[]> => {
    return apiClient.get<Seat[]>('/api/v1/seats');
  },

  // 예약 생성
  createReservation: async (data: CreateReservationData): Promise<Reservation> => {
    return apiClient.post<Reservation>('/api/v1/reservations', data);
  },

  // 내 예약 목록 조회
  getMyReservations: async (): Promise<Reservation[]> => {
    return apiClient.get<Reservation[]>('/api/v1/reservations/my');
  },

  // 예약 취소
  cancelReservation: async (reservationId: number): Promise<void> => {
    return apiClient.delete(`/api/v1/reservations/${reservationId}`);
  },
};

// 서버 컴포넌트용 예약 API
export const serverReservationAPI = {
  // 서버에서 좌석 목록 조회 (SSR용)
  getSeats: async (): Promise<Seat[]> => {
    return serverApiClient.get<Seat[]>('/api/v1/seats');
  },
};