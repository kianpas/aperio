"use client";

import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaChair,
  FaCreditCard,
  FaArrowRight,
} from "react-icons/fa";
import SeatSelectionStep from "@/components/reservation/SeatSelectionStep";
import DateTimeSelectionStep from "@/components/reservation/DateTimeSelectionStep";
import PaymentStep from "@/components/reservation/PaymentStep";
import { Seat, TimeSlot, Coupon, PlanType } from "@/types/reservation";
import { useReservation } from "@/hooks/useReservation";
import { buildPayloadFromState } from "@/types/reservation";

// Sample coupons as module-level constant (no useMemo needed)
// 샘플 쿠폰 데이터 (실제로는 API에서 가져올 데이터)
const SAMPLE_COUPON: Coupon[] = [
  {
    id: "WELCOME10",
    name: "신규 회원 특가",
    discount: 10,
    type: "percentage",
    description: "첫 예약 10% 할인",
  },
  {
    id: "FIXED5000",
    name: "얼리버드 할인",
    discount: 5000,
    type: "fixed",
    description: "오전 예약 시 5,000원 할인",
  },
  {
    id: "MONTHLY20",
    name: "월정액 프리미엄",
    discount: 20,
    type: "percentage",
    description: "월정액 20% 할인 + 무료 커피",
  },
];

const ReservationPage = () => {
  // 상태 관리
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [planType, setPlanType] = useState<PlanType>("HOURLY");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  // Hydration mismatch 방지: 클라이언트 마운트 후에만 시간 렌더
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { createReservation } = useReservation();

  const handlePayment = async () => {
    const payload = buildPayloadFromState(
      selectedSeat,
      planType,
      selectedDate,
      selectedTimes,
      selectedCoupon || undefined
    );

    if (!payload) {
      alert("좌석/날짜/시간 선택을 확인해주세요.");
      return;
    }

    try {
      const result = await createReservation(payload);
      console.log("Reservation created:", result);
      alert("예약 생성이 완료되었습니다.");
      // TODO: 결제 ready API로 이어지게 연결하거나, 예약 상세로 이동
    } catch (e: any) {
      const msg =
        e?.message || "예약에 실패했습니다. 잠시 후 다시 시도해주세요.";
      alert(msg);
    }
  };

  // 샘플 데이터
  const sampleSeats: Seat[] = [
    {
      id: "1",
      name: "Focus Zone A1",
      type: "individual",
      status: "available",
      price: 2000,
      features: ["Wi-Fi", "전원", "조명"],
      capacity: 1,
    },
    {
      id: "2",
      name: "Focus Zone A2",
      type: "individual",
      status: "unavailable",
      price: 2000,
      features: ["Wi-Fi", "전원", "조명"],
      capacity: 1,
    },
    {
      id: "3",
      name: "Focus Zone A3",
      type: "individual",
      status: "available",
      price: 2000,
      features: ["Wi-Fi", "전원", "조명"],
      capacity: 1,
    },
    {
      id: "4",
      name: "Focus Zone A4",
      type: "individual",
      status: "available",
      price: 2000,
      features: ["Wi-Fi", "전원", "조명"],
      capacity: 1,
    },
    {
      id: "5",
      name: "Premium Desk B1",
      type: "individual",
      status: "available",
      price: 3000,
      features: ["Wi-Fi", "전원", "모니터", "커피"],
      capacity: 1,
    },
    {
      id: "6",
      name: "Premium Desk B2",
      type: "individual",
      status: "selected",
      price: 3000,
      features: ["Wi-Fi", "전원", "모니터", "커피"],
      capacity: 1,
    },
    {
      id: "7",
      name: "Innovation Room",
      type: "meeting",
      status: "available",
      price: 8000,
      features: ["Wi-Fi", "프로젝터", "화이트보드", "커피"],
      capacity: 8,
    },
    {
      id: "8",
      name: "Collaboration Hub",
      type: "meeting",
      status: "available",
      price: 6000,
      features: ["Wi-Fi", "TV", "화이트보드"],
      capacity: 6,
    },
    {
      id: "9",
      name: "Phone Booth Alpha",
      type: "phone",
      status: "available",
      price: 1500,
      features: ["방음", "Wi-Fi", "전원"],
      capacity: 1,
    },
    {
      id: "P2",
      name: "Phone Booth Beta",
      type: "phone",
      status: "unavailable",
      price: 1500,
      features: ["방음", "Wi-Fi", "전원"],
      capacity: 1,
    },
  ];

  const sampleTimeSlots: TimeSlot[] = [
    { time: "09:00", available: true, selected: false, price: 2000 },
    { time: "10:00", available: true, selected: false, price: 2000 },
    { time: "11:00", available: false, selected: false, price: 2000 },
    { time: "12:00", available: true, selected: false, price: 2500 },
    { time: "13:00", available: true, selected: false, price: 2500 },
    { time: "14:00", available: true, selected: false, price: 2500 },
    { time: "15:00", available: false, selected: false, price: 2500 },
    { time: "16:00", available: true, selected: false, price: 2000 },
    { time: "17:00", available: true, selected: false, price: 2000 },
    { time: "18:00", available: true, selected: false, price: 1800 },
  ];

  // 좌석 선택 핸들러
  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === "unavailable") return;

    if (selectedSeat?.id === seat.id) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
      // setCurrentStep(2);
    }
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (time: string) => {
    if (planType !== "HOURLY") return;

    setSelectedTimes((prev) => {
      if (prev.includes(time)) {
        return prev.filter((t) => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  // 가격 계산
  useEffect(() => {
    if (!selectedSeat) {
      setTotalPrice(0);
      return;
    }

    let price = 0;

    switch (planType) {
      case "HOURLY":
        price = selectedSeat.price * selectedTimes.length;
        break;
      case "DAILY":
        price = 10000;
        break;
      case "MONTHLY":
        price = 99000;
        break;
    }

    // 쿠폰 할인 적용
    if (selectedCoupon) {
      const coupon = SAMPLE_COUPON.find((c) => c.id === selectedCoupon);
      if (coupon) {
        if (coupon.type === "percentage") {
          price = price * (1 - coupon.discount / 100);
        } else {
          price = Math.max(0, price - coupon.discount);
        }
      }
    }

    setTotalPrice(Math.floor(price));
  }, [selectedSeat, planType, selectedTimes, selectedCoupon, SAMPLE_COUPON]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 간단한 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">공간 예약</h1>
              <p className="text-gray-700 mt-1">
                원하는 공간과 시간을 선택하세요
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-700">실시간 업데이트</div>
              <div
                className="text-sm font-medium text-gray-900"
                suppressHydrationWarning
              >
                {mounted
                  ? new Intl.DateTimeFormat("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Seoul",
                    }).format(new Date())
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "공간 선택", icon: FaChair },
              { step: 2, title: "날짜 & 시간", icon: FaCalendarAlt },
              { step: 3, title: "결제", icon: FaCreditCard },
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="text-sm" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
                {step < 3 && <FaArrowRight className="ml-8 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {/* 메인 컨텐츠 - 탭 형태 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 탭 헤더 */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  currentStep === 1
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaChair className="inline mr-2" />
                공간 선택
              </button>
              <button
                onClick={() => selectedSeat && setCurrentStep(2)}
                disabled={!selectedSeat}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  currentStep === 2
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : selectedSeat
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <FaCalendarAlt className="inline mr-2" />
                날짜 & 시간
              </button>
              <button
                onClick={() =>
                  selectedSeat && selectedDate && setCurrentStep(3)
                }
                disabled={!selectedSeat || !selectedDate}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  currentStep === 3
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : selectedSeat && selectedDate
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <FaCreditCard className="inline mr-2" />
                결제
              </button>
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-8">
            {/* 1단계: 공간 선택 */}
            {currentStep === 1 && (
              <SeatSelectionStep
                seats={sampleSeats}
                selectedSeat={selectedSeat}
                onSeatSelect={handleSeatSelect}
              />
            )}

            {/* 2단계: 날짜 & 시간 선택 */}
            {currentStep === 2 && (
              <DateTimeSelectionStep
                selectedSeat={selectedSeat}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                planType={planType}
                onPlanTypeChange={setPlanType}
                selectedTimes={selectedTimes}
                onTimeSelect={handleTimeSelect}
                timeSlots={sampleTimeSlots}
              />
            )}

            {/* 3단계: 결제 */}
            {currentStep === 3 && (
              <PaymentStep
                selectedSeat={selectedSeat}
                selectedDate={selectedDate}
                planType={planType}
                selectedTimes={selectedTimes}
                coupons={SAMPLE_COUPON}
                selectedCoupon={selectedCoupon}
                onCouponChange={setSelectedCoupon}
                totalPrice={totalPrice}
              />
            )}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => {
                if (currentStep === 1 && selectedSeat) setCurrentStep(2);
                else if (currentStep === 2 && selectedDate) setCurrentStep(3);
              }}
              disabled={
                (currentStep === 1 && !selectedSeat) ||
                (currentStep === 2 &&
                  (!selectedDate ||
                    (planType === "HOURLY" && selectedTimes.length === 0)))
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              다음
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handlePayment}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-semibold"
            >
              <FaCreditCard className="mr-2" />
              결제하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
