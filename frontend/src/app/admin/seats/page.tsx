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
}

const SeatsPage = () => {
  const [selectedFloor, setSelectedFloor] = useState("1F");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

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
    },
  ];

  const stats = [
    {
      title: "전체 좌석",
      value: "120석",
      subValue: "수용 인원 150명",
      icon: FaChair,
      color: "blue",
    },
    {
      title: "사용중",
      value: "67석",
      subValue: "56% 사용률",
      icon: FaUsers,
      color: "green",
    },
    {
      title: "예약 가능",
      value: "48석",
      subValue: "40% 여유",
      icon: FaMapMarkerAlt,
      color: "yellow",
    },
    {
      title: "점검중",
      value: "5석",
      subValue: "4% 불가",
      icon: FaTools,
      color: "red",
    },
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

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">좌석 관리</h1>
          <p className="text-gray-600 mt-2">
            전체 {stats[0].value}의 좌석을 관리하고 모니터링합니다
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaMapMarkerAlt />
            <span>좌석 배치도</span>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`text-xl text-${stat.color}-600`} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{stat.subValue}</p>
          </div>
        ))}
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1F">1층</option>
              <option value="2F">2층</option>
              <option value="3F">3층</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">전체 상태</option>
              <option value="available">사용 가능</option>
              <option value="occupied">사용중</option>
              <option value="reserved">예약됨</option>
              <option value="maintenance">점검중</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">전체 유형</option>
              <option value="individual">개인석</option>
              <option value="meeting">회의실</option>
              <option value="lounge">라운지</option>
              <option value="phone">폰부스</option>
            </select>
          </div>
        </div>
      </div>

      {/* 좌석 그리드 뷰 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedFloor} 좌석 (
              {seats.filter((s) => s.floor === selectedFloor).length})
            </h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                좌석 배치도
              </button>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="grid">그리드 뷰</option>
                <option value="list">리스트 뷰</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seats
              .filter((seat) => seat.floor === selectedFloor)
              .map((seat) => (
                <div
                  key={seat.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`p-4 ${
                      seat.status === "available"
                        ? "bg-green-50"
                        : seat.status === "occupied"
                        ? "bg-blue-50"
                        : seat.status === "reserved"
                        ? "bg-yellow-50"
                        : "bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {seat.name}
                        </h3>
                        <p className="text-sm text-gray-600">{seat.location}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          seat.status === "available"
                            ? "bg-green-100 text-green-800"
                            : seat.status === "occupied"
                            ? "bg-blue-100 text-blue-800"
                            : seat.status === "reserved"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStatusText(seat.status)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        유형
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {seat.type === "individual"
                          ? "개인석"
                          : seat.type === "meeting"
                          ? "회의실"
                          : seat.type === "lounge"
                          ? "라운지"
                          : "폰부스"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        수용 인원
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {seat.capacity}인
                      </span>
                    </div>

                    {seat.currentUser && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          현재 사용자
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {seat.currentUser}
                          {seat.startTime && seat.endTime && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({seat.startTime} - {seat.endTime})
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      {seat.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <span className="font-bold text-blue-600">
                        {seat.price.toLocaleString()}원/시간
                      </span>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <FaEdit />
                        </button>
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
        </div>
      </div>

      {/* 좌석 추가/수정 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">새 좌석 추가</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  좌석 이름
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="예: Focus Zone A1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  유형
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="individual">개인석</option>
                  <option value="meeting">회의실</option>
                  <option value="phone">폰부스</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수용 인원
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시간당 가격
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2000"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  추가
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
