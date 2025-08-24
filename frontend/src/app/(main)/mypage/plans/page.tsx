"use client";

import { useState } from "react";
import { FaTag, FaCreditCard, FaCheck, FaInfoCircle } from "react-icons/fa";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isCurrent: boolean;
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: "hourly",
    name: "시간제",
    price: 2000,
    period: "시간",
    features: [
      "기본 시설 이용",
      "Wi-Fi 무제한",
      "커피 1잔 제공",
      "당일 예약 가능",
    ],
    isCurrent: false,
  },
  {
    id: "daily",
    name: "일일권",
    price: 10000,
    period: "일",
    features: [
      "모든 시설 이용",
      "Wi-Fi 무제한",
      "커피 무제한",
      "회의실 1시간 무료",
    ],
    isCurrent: true,
    isPopular: true,
  },
  {
    id: "monthly",
    name: "월정액",
    price: 99000,
    period: "월",
    features: [
      "모든 시설 무제한",
      "전용 사물함",
      "회의실 우선 예약",
      "네트워킹 이벤트 참여",
      "프리미엄 원두 커피",
    ],
    isCurrent: false,
  },
];

export default function PlansPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handlePlanChange = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowConfirm(true);
  };

  const currentPlan = plans.find(plan => plan.isCurrent);
  const getStatusCount = (status: string) => {
    switch(status) {
      case 'current': return plans.filter(p => p.isCurrent).length;
      case 'available': return plans.filter(p => !p.isCurrent).length;
      case 'popular': return plans.filter(p => p.isPopular).length;
      default: return plans.length;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">요금제 관리</h1>
          <p className="text-gray-600 mt-1">나에게 맞는 요금제를 선택하고 관리하세요.</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '전체 요금제', 
            count: getStatusCount('all'), 
            color: 'blue',
            description: '이용 가능한 모든 요금제'
          },
          { 
            label: '현재 이용중', 
            count: getStatusCount('current'), 
            color: 'green',
            description: '현재 구독중인 요금제'
          },
          { 
            label: '이용 가능', 
            count: getStatusCount('available'), 
            color: 'purple',
            description: '변경 가능한 요금제'
          },
          { 
            label: '인기 요금제', 
            count: getStatusCount('popular'), 
            color: 'yellow',
            description: '가장 많이 선택하는 요금제'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <FaTag className={`text-xl text-${stat.color}-600`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* 현재 요금제 정보 */}
      {currentPlan && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  현재 이용중인 요금제
                </h2>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span>{currentPlan.name}</span>
                  <span>•</span>
                  <span>다음 결제일: 2025년 8월 23일</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ₩{currentPlan.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                {currentPlan.period}당
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 요금제 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-md border-2 transition-all duration-300 ${
              plan.isCurrent
                ? "border-blue-500 shadow-blue-100"
                : "border-gray-100 hover:border-blue-200 hover:shadow-lg"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full">
                인기
              </div>
            )}
            {plan.isCurrent && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                현재 이용중
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">원/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <FaCheck className="text-green-500 mr-2 text-sm" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanChange(plan)}
                disabled={plan.isCurrent}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  plan.isCurrent
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                }`}
              >
                {plan.isCurrent ? "이용중" : "변경하기"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 안내사항 */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">안내사항</h4>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• 요금제 변경은 다음 결제일부터 적용됩니다.</li>
              <li>• 월정액 전환 시 남은 기간에 대한 금액이 정산됩니다.</li>
              <li>• 이용 중인 요금제의 해지는 고객센터로 문의해 주세요.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirm && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full m-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              요금제 변경 확인
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedPlan.name}으로 변경하시겠습니까?
              <br />
              변경된 요금제는 다음 결제일부터 적용됩니다.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert("요금제가 변경되었습니다.");
                  setShowConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
