"use client";

import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt } from "react-icons/fa";

const ReservationsPage = () => {
  const reservations = [
    {
      id: 1,
      user: "김철수",
      seat: "회의실 A",
      date: "2024-01-31",
      time: "09:00 - 12:00",
      status: "진행중",
      type: "회의실",
    },
    {
      id: 2,
      user: "이영희",
      seat: "데스크 #15",
      date: "2024-01-31",
      time: "13:00 - 18:00",
      status: "예약완료",
      type: "개인석",
    },
    {
      id: 3,
      user: "박민수",
      seat: "라운지 테이블",
      date: "2024-02-01",
      time: "10:00 - 16:00",
      status: "예약완료",
      type: "공용공간",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
          <p className="text-gray-600 mt-1">
            모든 예약 현황을 확인하고 관리합니다.
          </p>
        </div>
      </div>

      {/* 예약 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "오늘 예약",
            value: "24",
            color: "blue",
            icon: FaCalendarAlt,
          },
          { title: "진행중", value: "8", color: "green", icon: FaClock },
          { title: "대기중", value: "3", color: "yellow", icon: FaUser },
          { title: "완료", value: "13", color: "purple", icon: FaMapMarkerAlt },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`text-xl text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 예약 목록 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 예약</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {reservation.user.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {reservation.user}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        {reservation.seat}
                      </span>
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {reservation.date}
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {reservation.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      reservation.status === "진행중"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {reservation.status}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {reservation.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
