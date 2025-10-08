"use client";

import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { useState } from "react";
import { Reservation } from "@/types/reservation";

const ReservationClient = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  //   const getTabCount = (status: string) => {
  //     if (status === "all") return initialReservations.length;
  //     return initialReservations.filter((r) => r.status === status).length;
  //   };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* 탭 필터 */}
        {/* <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: "all", label: "전체" },
            { key: "upcoming", label: "예정" },
            { key: "completed", label: "완료" },
            { key: "cancelled", label: "취소" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key as "all" | "upcoming" | "completed" | "cancelled"
                )
              }
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label} ({getTabCount(tab.key)})
            </button>
          ))}
        </div> */}

        {/* 검색 */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="좌석명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationClient;
