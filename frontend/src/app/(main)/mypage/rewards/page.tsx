"use client";

import { useState } from "react";
import { FaGift, FaTag, FaClock, FaPlus } from "react-icons/fa";

interface Coupon {
  id: string;
  name: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minAmount: number;
  expiryDate: string;
  isUsed: boolean;
  description: string;
}

const sampleCoupons: Coupon[] = [
  {
    id: "C001",
    name: "신규 가입 특별 할인",
    code: "WELCOME2025",
    discount: 10,
    type: "percentage",
    minAmount: 0,
    expiryDate: "2025-09-30",
    isUsed: false,
    description: "첫 예약 시 사용 가능한 10% 할인 쿠폰",
  },
  {
    id: "C002",
    name: "월정액 할인",
    code: "MONTHLY20",
    discount: 20,
    type: "percentage",
    minAmount: 99000,
    expiryDate: "2025-12-31",
    isUsed: false,
    description: "월정액 결제 시 사용 가능한 20% 할인 쿠폰",
  },
  {
    id: "C003",
    name: "회의실 할인",
    code: "MEETING5000",
    discount: 5000,
    type: "fixed",
    minAmount: 20000,
    expiryDate: "2025-08-31",
    isUsed: true,
    description: "회의실 예약 시 사용 가능한 5,000원 할인 쿠폰",
  },
];

const benefits = [
  {
    title: "생일 특별 혜택",
    description: "생일 당일 예약 시 전 좌석 50% 할인",
    icon: "🎂",
  },
  {
    title: "친구 추천 혜택",
    description: "친구 추천 시 5,000원 적립금 지급",
    icon: "👥",
  },
  {
    title: "장기 이용 혜택",
    description: "3개월 이상 월정액 이용 시 10% 추가 할인",
    icon: "🌟",
  },
  {
    title: "얼리버드 할인",
    description: "오전 9시 이전 예약 시 30% 할인",
    icon: "🌅",
  },
];

export default function RewardsPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const availableCoupons = sampleCoupons.filter((coupon) => !coupon.isUsed);
  const usedCoupons = sampleCoupons.filter((coupon) => coupon.isUsed);

  const handleRegisterCoupon = () => {
    if (!couponCode.trim()) {
      alert("쿠폰 코드를 입력해주세요.");
      return;
    }
    // 실제로는 API 호출이 필요합니다
    alert("쿠폰이 등록되었습니다.");
    setCouponCode("");
    setShowRegister(false);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">쿠폰/혜택</h1>
            <p className="text-blue-100 text-lg">
              다양한 혜택으로 더 스마트하게 이용하세요
            </p>
          </div>
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <FaPlus className="mr-2" />
            쿠폰 등록
          </button>
        </div>
      </div>

      {/* 쿠폰 등록 패널 */}
      {showRegister && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">쿠폰 등록</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="쿠폰 코드를 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleRegisterCoupon}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              등록
            </button>
          </div>
        </div>
      )}

      {/* 사용 가능한 쿠폰 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          사용 가능한 쿠폰 ({availableCoupons.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {coupon.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{coupon.description}</p>
                </div>
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {coupon.type === "percentage"
                    ? `${coupon.discount}%`
                    : `${coupon.discount.toLocaleString()}원`}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <FaClock className="mr-1" />
                  {new Date(coupon.expiryDate).toLocaleDateString()} 까지
                </div>
                <div className="text-gray-500">
                  최소 주문금액:{" "}
                  <span className="font-medium">
                    {coupon.minAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">쿠폰 코드</span>
                  <span className="font-mono font-medium text-blue-600">
                    {coupon.code}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 회원 혜택 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">회원 혜택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 사용한 쿠폰 */}
      {usedCoupons.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            사용한 쿠폰 ({usedCoupons.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200 opacity-75"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {coupon.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{coupon.description}</p>
                  </div>
                  <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                    사용완료
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    {new Date(coupon.expiryDate).toLocaleDateString()} 만료
                  </div>
                  <div>
                    {coupon.type === "percentage"
                      ? `${coupon.discount}% 할인`
                      : `${coupon.discount.toLocaleString()}원 할인`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
