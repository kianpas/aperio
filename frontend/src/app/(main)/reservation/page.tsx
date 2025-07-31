"use client";

import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaChair,
  FaClock,
  FaClipboardList,
  FaTicketAlt,
  FaTags,
  FaCreditCard,
  FaCheck,
  FaCalendarDay,
  FaUsers,
  FaPhone,
  FaWifi,
  FaCoffee,
  FaDesktop,
  FaArrowRight,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

// 타입 정의
interface Seat {
  id: string;
  name: string;
  type: "individual" | "meeting" | "phone";
  status: "available" | "selected" | "unavailable";
  price: number;
  features: string[];
  capacity?: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
  selected: boolean;
  price?: number;
}

interface Coupon {
  id: string;
  name: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
}

const ReservationPage = () => {
  // 상태 관리
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [planType, setPlanType] = useState<"HOURLY" | "DAILY" | "MONTHLY">("HOURLY");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 샘플 데이터
  const sampleSeats: Seat[] = [
    { id: "A1", name: "Focus Zone A1", type: "individual", status: "available", price: 2000, features: ["Wi-Fi", "전원", "조명"], capacity: 1 },
    { id: "A2", name: "Focus Zone A2", type: "individual", status: "unavailable", price: 2000, features: ["Wi-Fi", "전원", "조명"], capacity: 1 },
    { id: "A3", name: "Focus Zone A3", type: "individual", status: "available", price: 2000, features: ["Wi-Fi", "전원", "조명"], capacity: 1 },
    { id: "A4", name: "Focus Zone A4", type: "individual", status: "available", price: 2000, features: ["Wi-Fi", "전원", "조명"], capacity: 1 },
    { id: "B1", name: "Premium Desk B1", type: "individual", status: "available", price: 3000, features: ["Wi-Fi", "전원", "모니터", "커피"], capacity: 1 },
    { id: "B2", name: "Premium Desk B2", type: "individual", status: "selected", price: 3000, features: ["Wi-Fi", "전원", "모니터", "커피"], capacity: 1 },
    { id: "M1", name: "Innovation Room", type: "meeting", status: "available", price: 8000, features: ["Wi-Fi", "프로젝터", "화이트보드", "커피"], capacity: 8 },
    { id: "M2", name: "Collaboration Hub", type: "meeting", status: "available", price: 6000, features: ["Wi-Fi", "TV", "화이트보드"], capacity: 6 },
    { id: "P1", name: "Phone Booth Alpha", type: "phone", status: "available", price: 1500, features: ["방음", "Wi-Fi", "전원"], capacity: 1 },
    { id: "P2", name: "Phone Booth Beta", type: "phone", status: "unavailable", price: 1500, features: ["방음", "Wi-Fi", "전원"], capacity: 1 },
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

  const sampleCoupons: Coupon[] = [
    { id: "WELCOME10", name: "신규 회원 특가", discount: 10, type: "percentage", description: "첫 예약 10% 할인" },
    { id: "FIXED5000", name: "얼리버드 할인", discount: 5000, type: "fixed", description: "오전 예약 시 5,000원 할인" },
    { id: "MONTHLY20", name: "월정액 프리미엄", discount: 20, type: "percentage", description: "월정액 20% 할인 + 무료 커피" },
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
    
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
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
      const coupon = sampleCoupons.find(c => c.id === selectedCoupon);
      if (coupon) {
        if (coupon.type === "percentage") {
          price = price * (1 - coupon.discount / 100);
        } else {
          price = Math.max(0, price - coupon.discount);
        }
      }
    }

    setTotalPrice(Math.floor(price));
  }, [selectedSeat, planType, selectedTimes, selectedCoupon]);

  // 좌석 타입별 아이콘 반환
  const getSeatIcon = (type: string) => {
    switch (type) {
      case "individual":
        return <FaDesktop className="text-lg" />;
      case "meeting":
        return <FaUsers className="text-lg" />;
      case "phone":
        return <FaPhone className="text-lg" />;
      default:
        return <FaChair className="text-lg" />;
    }
  };

  // 기능 아이콘 반환
  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "Wi-Fi":
        return <FaWifi className="text-xs" />;
      case "커피":
        return <FaCoffee className="text-xs" />;
      case "모니터":
        return <FaDesktop className="text-xs" />;
      default:
        return <FaCheck className="text-xs" />;
    }
  };

  // 결제 진행
  const handlePayment = () => {
    if (!selectedSeat || !selectedDate) {
      alert("좌석과 날짜를 선택해주세요.");
      return;
    }

    if (planType === "HOURLY" && selectedTimes.length === 0) {
      alert("시간을 선택해주세요.");
      return;
    }

    alert(`결제 진행!\n좌석: ${selectedSeat.name}\n날짜: ${selectedDate}\n요금제: ${planType}\n총 금액: ${totalPrice.toLocaleString()}원`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 간단한 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">공간 예약</h1>
              <p className="text-gray-600 mt-1">원하는 공간과 시간을 선택하세요</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">실시간 업데이트</div>
              <div className="text-sm font-medium text-gray-900">{new Date().toLocaleTimeString()}</div>
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  <Icon className="text-sm" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? "text-blue-600" : "text-gray-500"
                }`}>
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
                onClick={() => selectedSeat && selectedDate && setCurrentStep(3)}
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
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">어떤 공간을 원하시나요?</h2>
                  <p className="text-gray-600">용도에 맞는 공간을 선택해주세요</p>
                </div>

                {/* 공간 타입별 그리드 */}
                <div className="space-y-8">
                  {/* 개인 좌석 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaDesktop className="mr-2 text-blue-600" />
                      개인 작업 공간
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {sampleSeats.filter(seat => seat.type === "individual").map((seat) => (
                        <div
                          key={seat.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            seat.status === "unavailable"
                              ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                              : selectedSeat?.id === seat.id
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                          onClick={() => handleSeatSelect(seat)}
                        >
                          <div className="text-center">
                            {getSeatIcon(seat.type)}
                            <h4 className="font-semibold text-sm mt-2">{seat.name}</h4>
                            <p className="text-xs mt-1 opacity-75">
                              {seat.price.toLocaleString()}원/시간
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 회의실 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaUsers className="mr-2 text-purple-600" />
                      회의실
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {sampleSeats.filter(seat => seat.type === "meeting").map((seat) => (
                        <div
                          key={seat.id}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            seat.status === "unavailable"
                              ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                              : selectedSeat?.id === seat.id
                              ? "bg-purple-600 border-purple-600 text-white shadow-lg"
                              : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                          }`}
                          onClick={() => handleSeatSelect(seat)}
                        >
                          <div className="text-center">
                            {getSeatIcon(seat.type)}
                            <h4 className="font-bold text-base mt-3">{seat.name}</h4>
                            <p className="text-sm mt-1 opacity-75">
                              최대 {seat.capacity}인 • {seat.price.toLocaleString()}원/시간
                            </p>
                            <div className="flex justify-center mt-2 space-x-1">
                              {seat.features.slice(0, 3).map((feature, idx) => (
                                <span key={idx} className="text-xs opacity-60">
                                  {getFeatureIcon(feature)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 폰부스 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaPhone className="mr-2 text-green-600" />
                      폰부스
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {sampleSeats.filter(seat => seat.type === "phone").map((seat) => (
                        <div
                          key={seat.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            seat.status === "unavailable"
                              ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                              : selectedSeat?.id === seat.id
                              ? "bg-green-600 border-green-600 text-white shadow-lg"
                              : "bg-white border-gray-200 hover:border-green-300 hover:shadow-md"
                          }`}
                          onClick={() => handleSeatSelect(seat)}
                        >
                          <div className="text-center">
                            {getSeatIcon(seat.type)}
                            <h4 className="font-semibold text-sm mt-2">{seat.name}</h4>
                            <p className="text-xs mt-1 opacity-75">
                              {seat.price.toLocaleString()}원/시간
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2단계: 날짜 & 시간 선택 */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* 선택된 공간 정보 */}
                  {selectedSeat && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">선택된 공간</h3>
                      <div className="flex items-center">
                        {getSeatIcon(selectedSeat.type)}
                        <div className="ml-3">
                          <p className="font-medium">{selectedSeat.name}</p>
                          <p className="text-sm text-gray-600">{selectedSeat.price.toLocaleString()}원/시간</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 날짜 선택 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">날짜 선택</h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* 요금제 선택 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">요금제 선택</h3>
                    <div className="space-y-3">
                      {[
                        { value: "HOURLY", label: "시간제", desc: "필요한 시간만큼", badge: "인기" },
                        { value: "DAILY", label: "일일권", desc: "하루 종일 이용", badge: "절약" },
                        { value: "MONTHLY", label: "월정액권", desc: "한 달 무제한", badge: "프리미엄" },
                      ].map((plan) => (
                        <label
                          key={plan.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            planType === plan.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="planType"
                            value={plan.value}
                            checked={planType === plan.value}
                            onChange={(e) => setPlanType(e.target.value as any)}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{plan.label}</span>
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                {plan.badge}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{plan.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {/* 시간 선택 (시간제일 때만) */}
                  {planType === "HOURLY" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">시간 선택</h3>
                      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                        {sampleTimeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => handleTimeSelect(slot.time)}
                            disabled={!slot.available}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              !slot.available
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : selectedTimes.includes(slot.time)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-50 text-gray-700 hover:bg-blue-50"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                      {selectedTimes.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            선택된 시간: {selectedTimes.length}시간 ({selectedTimes.join(", ")})
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3단계: 결제 */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {/* 쿠폰 선택 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">할인 쿠폰</h3>
                    <div className="space-y-3">
                      {sampleCoupons.map((coupon) => (
                        <label
                          key={coupon.id}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedCoupon === coupon.id
                              ? "border-pink-500 bg-pink-50"
                              : "border-gray-200 hover:border-pink-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="coupon"
                            value={coupon.id}
                            checked={selectedCoupon === coupon.id}
                            onChange={(e) => setSelectedCoupon(e.target.value)}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{coupon.name}</span>
                              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                {coupon.type === "percentage" ? `${coupon.discount}%` : `${coupon.discount.toLocaleString()}원`} 할인
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{coupon.description}</p>
                          </div>
                        </label>
                      ))}
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all border-gray-200">
                        <input
                          type="radio"
                          name="coupon"
                          value=""
                          checked={selectedCoupon === ""}
                          onChange={(e) => setSelectedCoupon(e.target.value)}
                          className="mr-3"
                        />
                        <span className="font-medium text-gray-700">쿠폰 사용 안함</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  {/* 예약 요약 */}
                  <div className="bg-blue-600 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">예약 요약</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>공간</span>
                        <span className="font-medium">{selectedSeat?.name || "미선택"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>날짜</span>
                        <span className="font-medium">{selectedDate || "미선택"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>요금제</span>
                        <span className="font-medium">
                          {planType === "HOURLY" ? "시간제" : planType === "DAILY" ? "일일권" : "월정액권"}
                        </span>
                      </div>
                      {planType === "HOURLY" && selectedTimes.length > 0 && (
                        <div className="flex justify-between">
                          <span>시간</span>
                          <span className="font-medium">{selectedTimes.length}시간</span>
                        </div>
                      )}
                      <hr className="border-blue-400" />
                      <div className="flex justify-between text-xl font-bold">
                        <span>총 금액</span>
                        <span className="text-yellow-300">{totalPrice.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                (currentStep === 2 && (!selectedDate || (planType === "HOURLY" && selectedTimes.length === 0)))
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