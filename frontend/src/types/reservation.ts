// 예약 관련 타입 정의
export interface Seat {
  id: string;
  name: string;
  type: "individual" | "meeting" | "phone";
  status: "available" | "selected" | "unavailable";
  price: number;
  features: string[];
  capacity?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  selected: boolean;
  price?: number;
}

export interface Coupon {
  id: string;
  name: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
}

export type PlanType = "HOURLY" | "DAILY" | "MONTHLY";