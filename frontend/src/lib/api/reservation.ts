import { apiClient, serverApiClient } from "./client";
import type {
  CreateReservationPayload,
  CreateReservationResponse,
} from "@/types/reservation";

// ?�약 관???�?�들?� 별도 ?�일�?분리 ?�정
export interface ApiSeat {
  id: number;
  name: string;
  type: string;
  status: "available" | "occupied" | "maintenance";
  price: number;
}

export interface ApiReservation {
  id: number;
  seatId: number;
  userId: number;
  startTime: string;
  endTime: string;
  status: "active" | "completed" | "cancelled";
  totalPrice: number;
}

export type Reservation = ApiReservation;

export const reservationAPI = {
  // 좌석 목록 조회
  getSeats: async (): Promise<ApiSeat[]> => {
    return apiClient.get<ApiSeat[]>("/api/v1/seats");
  },

  // 예약 등록
  createReservation: async (
    payload: CreateReservationPayload
  ): Promise<CreateReservationResponse> => {
    return apiClient.post<CreateReservationResponse>(
      "/api/v1/reservations",
      payload
    );
  },

  // 예약 목록 조회
  getMyReservations: async (): Promise<ApiReservation[]> => {
    return apiClient.get<ApiReservation[]>("/api/v1/reservations/my");
  },

  // 예약 취소
  cancelReservation: async (reservationId: number): Promise<void> => {
    return apiClient.delete(`/api/v1/reservations/${reservationId}`);
  },
};

// 서버컴포넌트 예약
export const serverReservationAPI = {
  getSeats: async (): Promise<ApiSeat[]> => {
    return serverApiClient.get<ApiSeat[]>("/api/v1/seats");
  },
};
