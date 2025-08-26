"use client";

import { useState } from "react";
import {
  FaChair,
  FaUsers,
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaTools,
  FaSearch,
  FaFilter,
  FaEye,
  FaArrowRight,
  FaCog,
  FaChartBar,
  FaWifi,
  FaDesktop,
  FaLightbulb,
  FaVideo,
  FaCoffee,
  FaVolumeUp,
  FaThLarge,
  FaList,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaPlay,
  FaPause,
  FaStop,
} from "react-icons/fa";

interface Seat {
  id: string;
  name: string;
  type: "individual" | "meeting" | "phone" | "lounge";
  status: "available" | "occupied" | "maintenance" | "reserved";
  capacity: number;
  features: string[];
  currentUser?: string;
  startTime?: string;
  endTime?: string;
  floor: string;
  location: string;
  price: number;
  lastMaintenance?: string;
  utilizationRate?: number;
  revenue?: number;
}

const SeatsPage = () => {
  const [selectedFloor, setSelectedFloor] = useState("1F");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const seats: Seat[] = [
    {
      id: "A101",
      name: "Focus Zone A101",
      type: "individual",
      status: "available",
      capacity: 1,
      features: ["Wi-Fi", "전원", "모니터", "조명"],
      price: 2000,
      floor: "1F",
      location: "A구역",
      lastMaintenance: "2024-02-15",
      utilizationRate: 85,
      revenue: 156000,
    },
    {
      id: "M201",
      name: "회의실 201",
      type: "meeting",
      status: "occupied",
      capacity: 6,
      features: ["Wi-Fi", "프로젝터", "화이트보드", "화상회의"],
      currentUser: "김철수",
      startTime: "14:00",
      endTime: "16:00",
      price: 8000,
      floor: "2F",
      location: "B구역",
      utilizationRate: 92,
      revenue: 480000,
    },
    {
      id: "L301",
      name: "라운지 A",
      type: "lounge",
      status: "reserved",
      capacity: 4,
      features: ["Wi-Fi", "소파", "테이블", "커피머신"],
      price: 5000,
      floor: "3F",
      location: "C구역",
      utilizationRate: 67,
      revenue: 245000,
    },
    {
      id: "P102",
      name: "폰부스 102",
      type: "phone",
      status: "maintenance",
      capacity: 1,
      features: ["방음", "전원", "화상통화"],
      price: 1500,
      floor: "1F",
      location: "D구역",
      lastMaintenance: "2024-02-20",
      utilizationRate: 45,
      revenue: 89000,
    },
  ];

  // 빠른 액션 카드 데이터
  const quickActions = [
    {
      title: "좌석 배치도",
      description: "시각적 좌석 레이아웃 관리",
      count: "3개 층",
      icon: FaMapMarkerAlt,
      color: "blue",
      href: "/admin/seats/layout",
    },
    {
      title: "이용률 분석",
      description: "좌석별 사용 패턴 분석",
      count: "평균 72%",
      icon: FaChartBar,
      color: "green",
      href: "/admin/analytics/seats",
    },
    {
      title: "유지보수",
      description: "정기 점검 및 수리 관리",
      count: "5개 대기",
      icon: FaTools,
      color: "orange",
      href: "/admin/seats/maintenance",
    },
  ];

  const stats = [
    { label: "전체 좌석", value: "120", change: "+5%", trend: "up" },
    { label: "사용중", value: "67", change: "+12%", trend: "up" },
    { label: "예약 가능", value: "48", change: "-3%", trend: "down" },
    { label: "점검중", value: "5", change: "-20%", trend: "down" },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "사용 가능";
      case "occupied":
        return "사용중";
      case "maintenance":
        return "점검중";
      case "reserved":
        return "예약됨";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "individual":
        return "개인석";
      case "meeting":
        return "회의실";
      case "lounge":
        return "라운지";
      case "phone":
        return "폰부스";
      default:
        return type;
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "wi-fi":
        return <FaWifi className="w-3 h-3" />;
      case "모니터":
      case "프로젝터":
        return <FaDesktop className="w-3 h-3" />;
      case "조명":
        return <FaLightbulb className="w-3 h-3" />;
      case "화상회의":
      case "화상통화":
        return <FaVideo className="w-3 h-3" />;
      case "커피머신":
        return <FaCoffee className="w-3 h-3" />;
      case "방음":
        return <FaVolumeUp className="w-3 h-3" />;
      default:
        return <FaCog className="w-3 h-3" />;
    }
  };

  const filteredSeats = seats.filter((seat) => {
    const matchesSearch =
      seat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seat.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFloor = seat.floor === selectedFloor;
    const matchesFilter =
      selectedFilter === "all" || seat.status === selectedFilter;

    return matchesSearch && matchesFloor && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">좌석 관리</h1>
          <p className="text-gray-600 mt-2">
            총 120개의 좌석을 관리하고 모니터링합니다
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter />
            <span>필터</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            <span>새 좌석</span>
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
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
              placeholder="좌석 번호, 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="1F" className="text-gray-900">
                1층
              </option>
              <option value="2F" className="text-gray-900">
                2층
              </option>
              <option value="3F" className="text-gray-900">
                3층
              </option>
            </select>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">
                전체 상태
              </option>
              <option value="available" className="text-gray-900">
                사용 가능
              </option>
              <option value="occupied" className="text-gray-900">
                사용중
              </option>
              <option value="reserved" className="text-gray-900">
                예약됨
              </option>
              <option value="maintenance" className="text-gray-900">
                점검중
              </option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
              <option value="all" className="text-gray-900">
                전체 유형
              </option>
              <option value="individual" className="text-gray-900">
                개인석
              </option>
              <option value="meeting" className="text-gray-900">
                회의실
              </option>
              <option value="lounge" className="text-gray-900">
                라운지
              </option>
              <option value="phone" className="text-gray-900">
                폰부스
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 뷰 모드 토글 및 좌석 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedFloor} 좌석 목록 ({filteredSeats.length}개)
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaThLarge />
                  <span>그리드</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaList />
                  <span>리스트</span>
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <FaMapMarkerAlt />
                <span>배치도 보기</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === "grid" ? (
            /* 그리드 뷰 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeats.map((seat) => (
                <div
                  key={seat.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                >
                  {/* 좌석 헤더 */}
                  <div className="relative p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            seat.type === "individual"
                              ? "bg-blue-100"
                              : seat.type === "meeting"
                              ? "bg-purple-100"
                              : seat.type === "lounge"
                              ? "bg-green-100"
                              : "bg-orange-100"
                          }`}
                        >
                          {seat.type === "individual" ? (
                            <FaDesktop className="text-blue-600" />
                          ) : seat.type === "meeting" ? (
                            <FaUsers className="text-purple-600" />
                          ) : seat.type === "lounge" ? (
                            <FaCoffee className="text-green-600" />
                          ) : (
                            <FaVolumeUp className="text-orange-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {seat.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {seat.id} • {seat.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {seat.status === "available" && (
                          <FaCheckCircle className="text-green-500" />
                        )}
                        {seat.status === "occupied" && (
                          <FaPlay className="text-blue-500" />
                        )}
                        {seat.status === "reserved" && (
                          <FaClock className="text-yellow-500" />
                        )}
                        {seat.status === "maintenance" && (
                          <FaExclamationTriangle className="text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* 상태 배지 */}
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          seat.status
                        )}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            seat.status === "available"
                              ? "bg-green-400"
                              : seat.status === "occupied"
                              ? "bg-blue-400"
                              : seat.status === "reserved"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        ></span>
                        {getStatusText(seat.status)}
                      </span>
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {getTypeText(seat.type)}
                      </span>
                    </div>
                  </div>

                  {/* 좌석 정보 */}
                  <div className="p-4 space-y-4">
                    {/* 현재 사용자 정보 */}
                    {seat.currentUser && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {seat.currentUser.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {seat.currentUser}
                              </p>
                              <p className="text-xs text-gray-600">
                                {seat.startTime} - {seat.endTime}
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 좌석 세부 정보 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">수용인원</span>
                        <p className="font-medium text-gray-900">
                          {seat.capacity}명
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">시간당 요금</span>
                        <p className="font-medium text-blue-600">
                          {seat.price.toLocaleString()}원
                        </p>
                      </div>
                      {seat.utilizationRate && (
                        <div>
                          <span className="text-gray-500">이용률</span>
                          <p className="font-medium text-gray-900">
                            {seat.utilizationRate}%
                          </p>
                        </div>
                      )}
                      {seat.revenue && (
                        <div>
                          <span className="text-gray-500">월 매출</span>
                          <p className="font-medium text-green-600">
                            {seat.revenue.toLocaleString()}원
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 편의시설 */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">편의시설</p>
                      <div className="flex flex-wrap gap-2">
                        {seat.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded-full"
                          >
                            {getFeatureIcon(feature)}
                            <span>{feature}</span>
                          </span>
                        ))}
                      </div>
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
                          <FaTools />
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
          ) : (
            /* 리스트 뷰 */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      좌석
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      현재 사용자
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이용률
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      요금
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSeats.map((seat) => (
                    <tr
                      key={seat.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-lg mr-3 ${
                              seat.type === "individual"
                                ? "bg-blue-100"
                                : seat.type === "meeting"
                                ? "bg-purple-100"
                                : seat.type === "lounge"
                                ? "bg-green-100"
                                : "bg-orange-100"
                            }`}
                          >
                            {seat.type === "individual" ? (
                              <FaDesktop className="text-blue-600" />
                            ) : seat.type === "meeting" ? (
                              <FaUsers className="text-purple-600" />
                            ) : seat.type === "lounge" ? (
                              <FaCoffee className="text-green-600" />
                            ) : (
                              <FaVolumeUp className="text-orange-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {seat.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {seat.id} • {seat.location} •{" "}
                              {getTypeText(seat.type)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            seat.status
                          )}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              seat.status === "available"
                                ? "bg-green-400"
                                : seat.status === "occupied"
                                ? "bg-blue-400"
                                : seat.status === "reserved"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                          ></span>
                          {getStatusText(seat.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seat.currentUser ? (
                          <div>
                            <div className="font-medium">
                              {seat.currentUser}
                            </div>
                            <div className="text-gray-500">
                              {seat.startTime} - {seat.endTime}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seat.utilizationRate ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${seat.utilizationRate}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">
                              {seat.utilizationRate}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {seat.price.toLocaleString()}원/시간
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
                            <FaEdit />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
                            <FaTools />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 좌석 추가/수정 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  새 좌석 추가
                </h2>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      좌석 ID
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: A101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      좌석 이름
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: Focus Zone A101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      좌석 유형
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="individual">개인석</option>
                      <option value="meeting">회의실</option>
                      <option value="lounge">라운지</option>
                      <option value="phone">폰부스</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      수용 인원
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              {/* 위치 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  위치 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      층
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="1F">1층</option>
                      <option value="2F">2층</option>
                      <option value="3F">3층</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      구역
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: A구역"
                    />
                  </div>
                </div>
              </div>

              {/* 요금 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  요금 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시간당 요금 (원)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상태
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="available">사용 가능</option>
                      <option value="maintenance">점검중</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 편의시설 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  편의시설
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "wifi", label: "Wi-Fi", icon: FaWifi },
                    { id: "monitor", label: "모니터", icon: FaDesktop },
                    { id: "power", label: "전원", icon: FaLightbulb },
                    { id: "projector", label: "프로젝터", icon: FaVideo },
                    { id: "whiteboard", label: "화이트보드", icon: FaEdit },
                    { id: "coffee", label: "커피머신", icon: FaCoffee },
                    { id: "soundproof", label: "방음", icon: FaVolumeUp },
                    { id: "videoconf", label: "화상회의", icon: FaVideo },
                  ].map((feature) => (
                    <label
                      key={feature.id}
                      className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <feature.icon className="text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {feature.label}
                      </span>
                    </label>
                  ))}
                </div>
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  좌석 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatsPage;
