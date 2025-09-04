// 예약 관련 타입 정의
// 화면(UI)에서 사용하는 좌석/타임슬롯/쿠폰과 서버 전송 페이로드/유틸을 한 곳에 모았습니다.
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
/**
 * 날짜(YYYY-MM-DD)와 시각(HH:mm)을 ISO-8601 문자열로 변환합니다.
 */
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

/**
 * CreateReservationPayload 형태 판별 가드
 * (간단한 런타임 체크로 TypeScript에서 타입을 좁힐 때 사용 가능)
 */
export function isCreateReservationPayload(
  v: unknown
): v is CreateReservationPayload {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  const hasCoreFields =
    typeof o.seatId === "number" &&
    typeof o.planType === "string" &&
    typeof o.startAt === "string" &&
    typeof o.endAt === "string";
  return hasCoreFields;
}

/**
 * 서버가 예약 생성 후 반환하는 응답 형태(예시).
 * 서버 응답 DTO가 확정되면 필드명을 맞춰 주세요.
 */
export interface CreateReservationResponse {
  reservationId: number;
  status: string; // PENDING | CONFIRMED | ...
  paymentRequired?: boolean;
  paymentRedirectUrl?: string;
}
