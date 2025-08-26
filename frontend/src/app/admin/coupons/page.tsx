"use client";

import { useState } from "react";
import {
  FaTicketAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaFilter,
  FaEye,
  FaArrowRight,
  FaCog,
  FaChartBar,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPercent,
  FaDollarSign,
  FaUsers,
  FaGift,
  FaCopy,
  FaDownload,
} from "react-icons/fa";

interface Coupon {
  id: string;
  name: string;
  code: string;
  type: "percentage" | "fixed" | "free";
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
  targetUsers: "all" | "new" | "vip";
}

const CouponsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const coupons: Coupon[] = [
    {
      id: "C001",
      name: "신규 회원 환영 쿠폰",
      code: "WELCOME2024",
      type: "percentage",
      value: 20,
      minAmount: 10000,
      maxDiscount: 5000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: 1000,
      usedCount: 245,
      isActive: true,
      description: "신규 회원 대상 20% 할인 쿠폰",
      targetUsers: "new",
    },
    {
      id: "C002",
      name: "여름 시즌 특가",
      code: "SUMMER50",
      type: "fixed",
      value: 5000,
      minAmount: 20000,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      usageLimit: 500,
      usedCount: 123,
      isActive: true,
      description: "여름 시즌 5,000원 할인",
      targetUsers: "all",
    },
    {
      id: "C003",
      name: "VIP 전용 쿠폰",
      code: "VIP2024",
      type: "percentage",
      value: 30,
      minAmount: 50000,
      maxDiscount: 20000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: 100,
      usedCount: 67,
      isActive: true,
      description: "VIP 회원 전용 30% 할인",
      targetUsers: "vip",
    },
  ];

  const stats = [
    { label: "전체 쿠폰", value: "12", change: "+3", trend: "up" },
    { label: "활성 쿠폰", value: "8", change: "+1", trend: "up" },
    { label: "총 사용량", value: "435", change: "+52", trend: "up" },
    { label: "할인 금액", value: "₩2.1M", change: "+15%", trend: "up" }
  ];

  const quickActions = [
    {
      title: "쿠폰 성과 분석",
      description: "쿠폰별 사용률 및 매출 기여도",
      count: "평균 사용률 35%",
      icon: FaChartBar,
      color: "blue",
      href: "/admin/analytics/coupons"
    },
    {
      title: "대량 쿠폰 생성",
      description: "이벤트용 쿠폰 일괄 생성",
      count: "템플릿 5개",
      icon: FaCopy,
      color: "green",
      href: "/admin/coupons/bulk"
    },
    {
      title: "쿠폰 사용 내역",
      description: "사용자별 쿠폰 사용 현황",
      count: "435건 사용",
      icon: FaUsers,
      color: "purple",
      href: "/admin/coupons/usage"
    }
  ];

  const getCouponTypeText = (type: string) => {
    switch (type) {
      case "percentage": return "비율 할인";
      case "fixed": return "정액 할인";
      case "free": return "무료 제공";
      default: return type;
    }
  };

  const getCouponTypeIcon = (type: string) => {
    switch (type) {
      case "percentage": return <FaPercent className="text-blue-600" />;
      case "fixed": return <FaDollarSign className="text-green-600" />;
      case "free": return <FaGift className="text-purple-600" />;
      default: return <FaTicketAlt className="text-gray-600" />;
    }
  };

  const getTargetUsersText = (target: string) => {
    switch (target) {
      case "all": return "전체 회원";
      case "new": return "신규 회원";
      case "vip": return "VIP 회원";
      default: return target;
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "active" && coupon.isActive) ||
                         (selectedFilter === "inactive" && !coupon.isActive) ||
                         (selectedFilter === "expired" && new Date(coupon.endDate) < new Date());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">쿠폰 관리</h1>
          <p className="text-gray-600 mt-2">할인 쿠폰을 생성하고 관리하여 고객 만족도를 높입니다</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter />
            <span>필터</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            <span>새 쿠폰</span>
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 액션 카드 - Netflix/Spotify 스타일 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => console.log(`Navigate to ${action.href}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${action.color}-100`}>
                  <action.icon className={`text-2xl text-${action.color}-600`} />
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{action.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{action.count}</span>
                <span className="text-sm text-orange-600 group-hover:text-orange-700">
                  관리하기 →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 검색 및 필터 바 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="쿠폰명, 쿠폰 코드로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">전체 상태</option>
              <option value="active" className="text-gray-900">활성</option>
              <option value="inactive" className="text-gray-900">비활성</option>
              <option value="expired" className="text-gray-900">만료됨</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white">
              <option value="all" className="text-gray-900">전체 유형</option>
              <option value="percentage" className="text-gray-900">비율 할인</option>
              <option value="fixed" className="text-gray-900">정액 할인</option>
              <option value="free" className="text-gray-900">무료 제공</option>
            </select>
          </div>
        </div>
      </div>

      {/* 쿠폰 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              쿠폰 목록 ({filteredCoupons.length}개)
            </h3>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <FaDownload />
              <span>내보내기</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-200"
              >
                {/* 쿠폰 헤더 */}
                <div className="relative p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        coupon.type === "percentage" ? "bg-blue-100" :
                        coupon.type === "fixed" ? "bg-green-100" : "bg-purple-100"
                      }`}>
                        {getCouponTypeIcon(coupon.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                        <p className="text-sm text-gray-600">{coupon.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <FaCheckCircle className="w-3 h-3 mr-1" />
                          활성
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          <FaTimesCircle className="w-3 h-3 mr-1" />
                          비활성
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 할인 정보 */}
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-orange-600">
                      {coupon.type === "percentage" ? `${coupon.value}%` : 
                       coupon.type === "fixed" ? `₩${coupon.value.toLocaleString()}` : "무료"}
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        {getCouponTypeText(coupon.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 쿠폰 정보 */}
                <div className="p-4 space-y-4">
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                  
                  {/* 사용 조건 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">최소 주문금액</span>
                      <p className="font-medium text-gray-900">
                        {coupon.minAmount ? `₩${coupon.minAmount.toLocaleString()}` : "제한 없음"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">대상 회원</span>
                      <p className="font-medium text-gray-900">{getTargetUsersText(coupon.targetUsers)}</p>
                    </div>
                  </div>

                  {/* 사용 현황 */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">사용 현황</span>
                      <span className="font-medium text-gray-900">
                        {coupon.usedCount} / {coupon.usageLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 유효 기간 */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{coupon.startDate} ~ {coupon.endDate}</span>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaEye />
                        <span>상세</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <FaEdit />
                        <span>수정</span>
                      </button>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaCopy />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 쿠폰 추가 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">새 쿠폰 추가</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      쿠폰명
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="예: 신규 회원 환영 쿠폰"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      쿠폰 코드
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="예: WELCOME2024"
                    />
                  </div>
                </div>
              </div>

              {/* 할인 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">할인 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      할인 유형
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="percentage">비율 할인 (%)</option>
                      <option value="fixed">정액 할인 (원)</option>
                      <option value="free">무료 제공</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      할인 값
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최소 주문금액
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>

              {/* 사용 조건 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">사용 조건</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사용 제한 수량
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작일
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료일
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 대상 회원 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">대상 회원</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "all", label: "전체 회원" },
                    { id: "new", label: "신규 회원" },
                    { id: "vip", label: "VIP 회원" },
                  ].map((target) => (
                    <label key={target.id} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="targetUsers"
                        value={target.id}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{target.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  쿠폰 설명
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="쿠폰에 대한 설명을 입력하세요"
                />
              </div>

              {/* 활성화 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">쿠폰 활성화</span>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  쿠폰 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;