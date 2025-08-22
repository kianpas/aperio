"use client";

import { useState } from "react";
import { FaCreditCard, FaDownload, FaSearch } from "react-icons/fa";

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

  const filteredPayments = samplePayments.filter(
    (payment) =>
      payment.date.startsWith(selectedMonth) &&
      (payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalAmount = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">결제 내역</h1>
            <p className="text-blue-100 text-lg">
              모든 결제 내역을 한눈에 확인하세요
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalAmount.toLocaleString()}원</p>
            <p className="text-blue-100">이번 달 총 결제액</p>
          </div>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="결제 내역 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="w-48">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaDownload className="mr-2" />
            내역 다운로드
          </button>
        </div>
      </div>

      {/* 결제 내역 목록 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  결제 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  내용
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  결제 수단
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCreditCard className="mr-2" />
                      {payment.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status === "completed"
                        ? "완료"
                        : payment.status === "pending"
                        ? "처리중"
                        : "실패"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {payment.amount.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
