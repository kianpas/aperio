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

  const totalSavings = sampleCoupons
    .filter(c => c.isUsed)
    .reduce((sum, coupon) => {
      return sum + (coupon.type === 'fixed' ? coupon.discount : 0);
    }, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">쿠폰/혜택</h1>
          <p className="text-gray-600 mt-1">다양한 혜택으로 더 스마트하게 이용하세요.</p>
        </div>
        <button
          onClick={() => setShowRegister(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          쿠폰 등록
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '보유 쿠폰', 
            count: availableCoupons.length, 
            color: 'blue',
            description: '사용 가능한 쿠폰'
          },
          { 
            label: '사용한 쿠폰', 
            count: usedCoupons.length, 
            color: 'gray',
            description: '이미 사용한 쿠폰'
          },
          { 
            label: '총 절약 금액', 
            count: `${totalSavings.toLocaleString()}원`, 
            color: 'green',
            description: '쿠폰으로 절약한 금액'
          },
          { 
            label: '회원 혜택', 
            count: benefits.length, 
            color: 'purple',
            description: '이용 가능한 혜택'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <FaGift className={`text-xl text-${stat.color}-600`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{typeof stat.count === 'number' ? stat.count : stat.count}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
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
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            사용 가능한 쿠폰 ({availableCoupons.length})
          </h2>
        </div>
        {availableCoupons.length === 0 ? (
          <div className="p-12 text-center">
            <FaGift className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">사용 가능한 쿠폰이 없습니다</h3>
            <p className="text-gray-500">새로운 쿠폰을 등록해보세요.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {availableCoupons.map((coupon) => (
              <div key={coupon.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaTag className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {coupon.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {new Date(coupon.expiryDate).toLocaleDateString()} 까지
                        </span>
                        <span>
                          최소 {coupon.minAmount.toLocaleString()}원
                        </span>
                        <span className="font-mono text-blue-600">
                          {coupon.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      {coupon.type === "percentage"
                        ? `${coupon.discount}%`
                        : `${coupon.discount.toLocaleString()}원`}
                    </div>
                    <div className="text-sm text-gray-500">
                      할인
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {coupon.description}
                </div>
              </div>
            ))}
          </div>
        )}
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
