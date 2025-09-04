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

export interface CreateReservationPayload {
  seatId: number;
  planType: PlanType;
  startAt: string; // ISO-8601
  endAt: string; // ISO-8601
  timeSlots?: string[]; // HOURLY only
  userCouponId?: number;
  couponCode?: string;
  memo?: string;
}

export type PlanType = "HOURLY" | "DAILY" | "MONTHLY";

// 시간 유틸(간단 예시)
function toIso(date: string, time: string) {
  // date: "2025-03-20", time: "09:00"
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0);
  return dt.toISOString();
}

export function buildPayloadFromState(
  selectedSeat: { id: string | number } | null,
  planType: PlanType,
  selectedDate: string,
  selectedTimes: string[],
  selectedCoupon: string | undefined
): CreateReservationPayload | null {
  if (!selectedSeat || !selectedDate) return null;

  let startAt: string;
  let endAt: string;
  let timeSlots: string[] | undefined;

  if (planType === "HOURLY") {
    if (selectedTimes.length === 0) return null;
    const sorted = [...selectedTimes].sort(); // "09:00", "10:00"...
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const [lh, lm] = last.split(":").map(Number);
    const endHourPlus1 = `${String(lh + 1).padStart(2, "0")}:${String(
      lm
    ).padStart(2, "0")}`;

    startAt = toIso(selectedDate, first);
    endAt = toIso(selectedDate, endHourPlus1);
    timeSlots = sorted; // 서버에서 검증/보조 계산용
  } else if (planType === "DAILY") {
    startAt = toIso(selectedDate, "09:00");
    endAt = toIso(selectedDate, "18:00");
  } else {
    // MONTHLY(정책에 맞게)
    startAt = toIso(selectedDate, "00:00");
    // 간단하게 +30일(정확한 월말 계산은 별도 유틸 권장)
    const dt = new Date(selectedDate + "T00:00:00");
    const end = new Date(dt);
    end.setMonth(end.getMonth() + 1);
    endAt = end.toISOString();
  }

  const payload: CreateReservationPayload = {
    seatId: Number(selectedSeat.id),
    planType,
    startAt,
    endAt,
  };
  if (timeSlots) payload.timeSlots = timeSlots;
  if (selectedCoupon) payload.couponCode = selectedCoupon;

  return payload;
}
