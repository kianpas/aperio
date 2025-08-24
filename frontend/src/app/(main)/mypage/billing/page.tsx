"use client";

import { useState } from "react";
import { 
  FaCreditCard, 
  FaDownload, 
  FaSearch, 
  FaReceipt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaCalendarAlt,
  FaEye
} from "react-icons/fa";
import { SiKakao, SiNaver } from "react-icons/si";

interface Payment {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

const samplePayments: Payment[] = [
  {
    id: "P001",
    date: "2025-08-22",
    amount: 10000,
    type: "신용카드",
    status: "completed",
    description: "일일 이용권",
  },
  {
    id: "P002",
    date: "2025-08-20",
    amount: 8000,
    type: "카카오페이",
    status: "completed",
    description: "회의실 예약",
  },
  {
    id: "P003",
    date: "2025-08-15",
    amount: 99000,
    type: "신용카드",
    status: "completed",
    description: "월 정기권",
  },
  {
    id: "P004",
    date: "2025-08-10",
    amount: 15000,
    type: "네이버페이",
    status: "failed",
    description: "회의실 예약",
  },
];

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2025-08");
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filteredPayments = samplePayments.filter(
    (payment) =>
      payment.date.startsWith(selectedMonth) &&
      (payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === 'all' || payment.status === activeTab)
  );

  const totalAmount = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '완료', color: 'bg-green-100 text-green-800', icon: FaCheckCircle };
      case 'pending':
        return { label: '처리중', color: 'bg-yellow-100 text-yellow-800', icon: FaClock };
      case 'failed':
        return { label: '실패', color: 'bg-red-100 text-red-800', icon: FaExclamationTriangle };
      default:
        return { label: '알 수 없음', color: 'bg-gray-100 text-gray-800', icon: FaExclamationTriangle };
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case '카카오페이':
        return <SiKakao className="text-yellow-500" />;
      case '네이버페이':
        return <SiNaver className="text-green-500" />;
      default:
        return <FaCreditCard className="text-blue-500" />;
    }
  };

  const getTabCount = (status: string) => {
    if (status === 'all') return samplePayments.length;
    return samplePayments.filter(p => p.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">결제 내역</h1>
          <p className="text-gray-600 mt-1">모든 결제 내역을 한눈에 확인하세요.</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '전체 결제', 
            count: getTabCount('all'), 
            color: 'blue',
            amount: samplePayments.reduce((sum, p) => sum + p.amount, 0)
          },
          { 
            label: '완료된 결제', 
            count: getTabCount('completed'), 
            color: 'green',
            amount: samplePayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
          },
          { 
            label: '처리중인 결제', 
            count: getTabCount('pending'), 
            color: 'yellow',
            amount: samplePayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
          },
          { 
            label: '실패한 결제', 
            count: getTabCount('failed'), 
            color: 'red',
            amount: samplePayments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0)
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <FaReceipt className={`text-xl text-${stat.color}-600`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ₩{stat.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* 탭 필터 */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: '전체' },
              { key: 'completed', label: '완료' },
              { key: 'pending', label: '처리중' },
              { key: 'failed', label: '실패' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'completed' | 'pending' | 'failed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({getTabCount(tab.key)})
              </button>
            ))}
          </div>

          {/* 검색 및 필터 */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="결제 내역 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaDownload className="mr-2" />
              다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 결제 내역 목록 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <FaReceipt className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">결제 내역이 없습니다</h3>
            <p className="text-gray-500">선택한 조건에 맞는 결제 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const statusInfo = getStatusInfo(payment.status);
              const StatusIcon = statusInfo.icon;
              const PaymentIcon = getPaymentIcon(payment.type);

              return (
                <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {PaymentIcon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {payment.description}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {new Date(payment.date).toLocaleDateString('ko-KR')}
                          </span>
                          <span className="flex items-center">
                            <FaCreditCard className="mr-1" />
                            {payment.type}
                          </span>
                          <span className="text-gray-400">
                            ID: {payment.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ₩{payment.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="mr-1 text-xs" />
                        {statusInfo.label}
                      </span>

                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <FaEye />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 페이지네이션 (필요시) */}
      {filteredPayments.length > 0 && (
        <div className="flex items-center justify-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            이전
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            다음
          </button>
        </div>
      )}
    </div>
  );
}
