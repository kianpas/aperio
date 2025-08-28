"use client";

import { Seat, Coupon, PlanType } from "@/types/reservation";

interface PaymentStepProps {
  selectedSeat: Seat | null;
  selectedDate: string;
  planType: PlanType;
  selectedTimes: string[];
  coupons: Coupon[];
  selectedCoupon: string;
  onCouponChange: (couponId: string) => void;
  totalPrice: number;
}

// 쿠폰 선택 컴포넌트
const CouponSelector = ({ 
  coupons, 
  selectedCoupon, 
  onCouponChange 
}: { 
  coupons: Coupon[]; 
  selectedCoupon: string; 
  onCouponChange: (couponId: string) => void; 
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">할인 쿠폰</h3>
    <div className="space-y-3">
      {coupons.map((coupon) => (
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
            onChange={(e) => onCouponChange(e.target.value)}
            className="mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{coupon.name}</span>
              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {coupon.type === "percentage"
                  ? `${coupon.discount}%`
                  : `${coupon.discount.toLocaleString()}원`}{" "}
                할인
              </span>
            </div>
            <p className="text-sm text-gray-700">{coupon.description}</p>
          </div>
        </label>
      ))}
      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all border-gray-200">
        <input
          type="radio"
          name="coupon"
          value=""
          checked={selectedCoupon === ""}
          onChange={(e) => onCouponChange(e.target.value)}
          className="mr-3"
        />
        <span className="font-medium text-gray-800">쿠폰 사용 안함</span>
      </label>
    </div>
  </div>
);

// 예약 요약 컴포넌트
const ReservationSummary = ({ 
  selectedSeat, 
  selectedDate, 
  planType, 
  selectedTimes, 
  totalPrice 
}: { 
  selectedSeat: Seat | null; 
  selectedDate: string; 
  planType: PlanType; 
  selectedTimes: string[]; 
  totalPrice: number; 
}) => {
  const getPlanTypeLabel = (type: PlanType) => {
    switch (type) {
      case "HOURLY":
        return "시간제";
      case "DAILY":
        return "일일권";
      case "MONTHLY":
        return "월정액권";
      default:
        return type;
    }
  };

  return (
    <div className="bg-blue-600 rounded-xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">예약 요약</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>공간</span>
          <span className="font-medium">
            {selectedSeat?.name || "미선택"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>날짜</span>
          <span className="font-medium">{selectedDate || "미선택"}</span>
        </div>
        <div className="flex justify-between">
          <span>요금제</span>
          <span className="font-medium">{getPlanTypeLabel(planType)}</span>
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
          <span className="text-yellow-300">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

// 메인 결제 단계 컴포넌트
const PaymentStep = ({
  selectedSeat,
  selectedDate,
  planType,
  selectedTimes,
  coupons,
  selectedCoupon,
  onCouponChange,
  totalPrice,
}: PaymentStepProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        {/* 쿠폰 선택 */}
        <CouponSelector
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onCouponChange={onCouponChange}
        />
      </div>

      <div>
        {/* 예약 요약 */}
        <ReservationSummary
          selectedSeat={selectedSeat}
          selectedDate={selectedDate}
          planType={planType}
          selectedTimes={selectedTimes}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
};

export default PaymentStep;