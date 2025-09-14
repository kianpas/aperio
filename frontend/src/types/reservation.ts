// 예약 관련 타입 정의
// 화면(UI)에서 사용하는 좌석/타임슬롯/쿠폰과 서버 전송 페이로드/유틸을 한 곳에 모았습니다.
export interface Seat {
  id: string;
  name: string;
  seatType: "SINGLE" | "MEETING" | "phone";
  status: "available" | "selected" | "unavailable";
  description: string;
  hourlyPrice: number;
  dailyPrice: number;
  monthlyPrice: number;
  capacity: number;
  floor?: string;
  location?: string;
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

export interface Reservation {
  id: number;
  seatName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "completed" | "upcoming" | "cancelled" | "in-progress";
  price: number;
  reservationDate: string;
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

// 로컬 시각을 ISO-8601(+오프셋 포함)로 포맷
function formatLocalISOWithOffset(dt: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = dt.getFullYear();
  const MM = pad(dt.getMonth() + 1);
  const dd = pad(dt.getDate());
  const HH = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  const ss = pad(dt.getSeconds());

  const tzMin = -dt.getTimezoneOffset(); // KST면 -(-540)=+540
  const sign = tzMin >= 0 ? "+" : "-";
  const abs = Math.abs(tzMin);
  const oh = pad(Math.floor(abs / 60));
  const om = pad(abs % 60);

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}${sign}${oh}:${om}`;
}

// 날짜(YYYY-MM-DD) + 시각(HH:mm) -> 로컬 ISO(+오프셋)
function toIso(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return formatLocalISOWithOffset(dt);
}

// "마지막 선택 시간 + 1시간" 계산 시, 날짜 넘어감 처리
function addOneHour(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  const base = new Date(2000, 0, 1, hh, mm, 0, 0); // 임의의 기준일
  base.setHours(base.getHours() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(base.getHours())}:${pad(base.getMinutes())}`;
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
    const endPlus1 = addOneHour(last);

    startAt = toIso(selectedDate, first);
    endAt = toIso(selectedDate, endPlus1);
    timeSlots = sorted; // 서버에서 검증/보조 계산용
  } else if (planType === "DAILY") {
    startAt = toIso(selectedDate, "09:00");
    endAt = toIso(selectedDate, "18:00");
  } else {
    // MONTHLY: 로컬 기준으로 +1개월
    const [y, m, d] = selectedDate.split("-").map(Number);
    const start = new Date(y, m - 1, d, 0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    startAt = formatLocalISOWithOffset(start);
    endAt = formatLocalISOWithOffset(end);
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
