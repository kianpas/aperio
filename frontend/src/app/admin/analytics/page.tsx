"use client";

import { useState } from "react";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaUsers,
  FaCalendarAlt,
  FaChair,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaFilter,
  FaCalendar,
  FaEye,
  FaMousePointer,
  FaClock,
  FaPercentage,
  FaEquals,
  FaSearch,
  FaArrowRight,
  FaCog,
  FaPlus,
} from "react-icons/fa";

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // 주요 지표 데이터
  const keyMetrics = [
    {
      title: "총 매출",
      value: "₩2,450,000",
      change: "+12.5%",
      trend: "up",
      icon: FaDollarSign,
      color: "green",
      description: "지난 7일 대비",
    },
    {
      title: "예약 건수",
      value: "156",
      change: "+8.3%",
      trend: "up",
      icon: FaCalendarAlt,
      color: "blue",
      description: "지난 7일 대비",
    },
    {
      title: "좌석 이용률",
      value: "73.2%",
      change: "-2.1%",
      trend: "down",
      icon: FaChair,
      color: "orange",
      description: "지난 7일 대비",
    },
    {
      title: "신규 사용자",
      value: "24",
      change: "+15.4%",
      trend: "up",
      icon: FaUsers,
      color: "purple",
      description: "지난 7일 대비",
    },
  ];

  // 시간대별 예약 현황
  const hourlyData = [
    { hour: "09:00", reservations: 12, revenue: 180000 },
    { hour: "10:00", reservations: 18, revenue: 270000 },
    { hour: "11:00", reservations: 25, revenue: 375000 },
    { hour: "12:00", reservations: 15, revenue: 225000 },
    { hour: "13:00", reservations: 22, revenue: 330000 },
    { hour: "14:00", reservations: 28, revenue: 420000 },
    { hour: "15:00", reservations: 32, revenue: 480000 },
    { hour: "16:00", reservations: 29, revenue: 435000 },
    { hour: "17:00", reservations: 24, revenue: 360000 },
    { hour: "18:00", reservations: 16, revenue: 240000 },
  ];

  // 좌석 유형별 이용률
  const seatTypeData = [
    { type: "개인석", usage: 85, revenue: 1200000, color: "blue" },
    { type: "회의실", usage: 67, revenue: 800000, color: "green" },
    { type: "라운지", usage: 45, revenue: 350000, color: "purple" },
    { type: "폰부스", usage: 72, revenue: 180000, color: "orange" },
  ];

  // 인기 시간대
  const popularTimes = [
    { time: "14:00-16:00", percentage: 92, label: "최고 인기" },
    { time: "10:00-12:00", percentage: 87, label: "높은 인기" },
    { time: "16:00-18:00", percentage: 78, label: "보통 인기" },
    { time: "09:00-10:00", percentage: 65, label: "낮은 인기" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <FaArrowUp className="text-green-500" />;
      case "down":
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaEquals className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">통계 분석</h1>
          <p className="text-gray-600 mt-2">
            비즈니스 성과를 분석하고 데이터 기반 의사결정을 지원합니다
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">최근 7일</option>
            <option value="30days">최근 30일</option>
            <option value="90days">최근 90일</option>
            <option value="1year">최근 1년</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter />
            <span>필터</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            <FaDownload />
            <span>내보내기</span>
          </button>
        </div>
      </div>

      {/* 빠른 액션 카드 - Netflix/Spotify 스타일 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 분석</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "실시간 대시보드",
              description: "현재 운영 상황 실시간 모니터링",
              count: "실시간 업데이트",
              icon: FaChartLine,
              color: "blue",
              href: "/admin/analytics/realtime",
            },
            {
              title: "매출 분석",
              description: "기간별 매출 추이 및 예측",
              count: "월 +23.5% 성장",
              icon: FaDollarSign,
              color: "green",
              href: "/admin/analytics/revenue",
            },
            {
              title: "고객 분석",
              description: "사용자 행동 패턴 및 만족도",
              count: "4.6/5.0 만족도",
              icon: FaUsers,
              color: "purple",
              href: "/admin/analytics/customers",
            },
          ].map((action, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => console.log(`Navigate to ${action.href}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${action.color}-100`}>
                  <action.icon
                    className={`text-2xl text-${action.color}-600`}
                  />
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{action.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {action.count}
                </span>
                <span className="text-sm text-blue-600 group-hover:text-blue-700">
                  분석하기 →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                <metric.icon className={`text-2xl text-${metric.color}-600`} />
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(metric.trend)}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up"
                      ? "text-green-600"
                      : metric.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-600 text-sm">{metric.title}</p>
              <p className="text-gray-500 text-xs mt-1">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간대별 예약 현황 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              시간대별 예약 현황
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="reservations">예약 건수</option>
              <option value="revenue">매출</option>
            </select>
          </div>
          <div className="space-y-3">
            {hourlyData.map((data, index) => {
              const maxValue = Math.max(
                ...hourlyData.map((d) =>
                  selectedMetric === "reservations" ? d.reservations : d.revenue
                )
              );
              const value =
                selectedMetric === "reservations"
                  ? data.reservations
                  : data.revenue;
              const percentage = (value / maxValue) * 100;

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-gray-600 font-medium">
                    {data.hour}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm text-gray-900 font-medium text-right">
                    {selectedMetric === "reservations"
                      ? `${value}건`
                      : `₩${(value / 1000).toFixed(0)}K`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 좌석 유형별 이용률 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            좌석 유형별 성과
          </h3>
          <div className="space-y-4">
            {seatTypeData.map((seat, index) => (
              <div
                key={index}
                className="p-4 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full bg-${seat.color}-500`}
                    ></div>
                    <span className="font-medium text-gray-900">
                      {seat.type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {seat.usage}% 이용률
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className={`bg-${seat.color}-500 h-2 rounded-full`}
                      style={{ width: `${seat.usage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₩{(seat.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 인기 시간대 및 추가 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 인기 시간대 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            인기 시간대
          </h3>
          <div className="space-y-4">
            {popularTimes.map((time, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{time.time}</div>
                  <div className="text-sm text-gray-500">{time.label}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${time.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10">
                    {time.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 이번 주 요약 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            이번 주 요약
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">총 예약</span>
              <span className="font-semibold text-gray-900">156건</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">평균 이용 시간</span>
              <span className="font-semibold text-gray-900">3.2시간</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">취소율</span>
              <span className="font-semibold text-red-600">8.5%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">재방문율</span>
              <span className="font-semibold text-green-600">67%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t pt-4">
              <span className="text-gray-600">고객 만족도</span>
              <span className="font-semibold text-blue-600">4.6/5.0</span>
            </div>
          </div>
        </div>

        {/* 성장 지표 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            성장 지표
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">
                  월 매출 성장률
                </span>
                <FaArrowUp className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                +23.5%
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  신규 고객 증가
                </span>
                <FaArrowUp className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                +15.2%
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-orange-800 font-medium">
                  평균 예약 금액
                </span>
                <FaArrowDown className="text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-900 mt-1">
                -3.1%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 분석 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">상세 분석</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  예약 건수
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  매출
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이용률
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신규 고객
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전일 대비
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  date: "2024-02-26",
                  reservations: 28,
                  revenue: 420000,
                  usage: 78,
                  newUsers: 5,
                  change: "+12%",
                },
                {
                  date: "2024-02-25",
                  reservations: 25,
                  revenue: 375000,
                  usage: 72,
                  newUsers: 3,
                  change: "+8%",
                },
                {
                  date: "2024-02-24",
                  reservations: 22,
                  revenue: 330000,
                  usage: 68,
                  newUsers: 4,
                  change: "-5%",
                },
                {
                  date: "2024-02-23",
                  reservations: 30,
                  revenue: 450000,
                  usage: 85,
                  newUsers: 7,
                  change: "+15%",
                },
                {
                  date: "2024-02-22",
                  reservations: 26,
                  revenue: 390000,
                  usage: 75,
                  newUsers: 2,
                  change: "+3%",
                },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.reservations}건
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₩{row.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.usage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.newUsers}명
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        row.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
