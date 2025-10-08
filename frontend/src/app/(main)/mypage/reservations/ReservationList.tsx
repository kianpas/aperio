"use client";

import { useState } from "react";
import { Reservation } from "@/types/reservation";
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

const ReservationSearch = ({
  initialReservations,
}: {
  initialReservations: Reservation[];
}) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");



  console.log("initialReservations =>", initialReservations);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "완료",
          color: "bg-green-100 text-green-800",
          icon: FaCheckCircle,
        };
      case "upcoming":
        return {
          label: "예정",
          color: "bg-blue-100 text-blue-800",
          icon: FaClock,
        };
      case "cancelled":
        return {
          label: "취소",
          color: "bg-red-100 text-red-800",
          icon: FaTimes,
        };
      case "in-progress":
        return {
          label: "진행중",
          color: "bg-yellow-100 text-yellow-800",
          icon: FaSpinner,
        };
      default:
        return {
          label: "알 수 없음",
          color: "bg-gray-100 text-gray-800",
          icon: FaExclamationTriangle,
        };
    }
  };

  const filteredReservations = initialReservations.filter(
    (reservation: Reservation) => {
      const matchesTab =
        activeTab === "all" || reservation.status === activeTab;
      const matchesSearch = reservation.seatName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    }
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      {filteredReservations.length === 0 ? (
        <div className="p-12 text-center">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            예약 내역이 없습니다
          </h3>
          <p className="text-gray-500">새로운 예약을 만들어보세요.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredReservations.map((reservation: Reservation) => {
            const statusInfo = getStatusInfo(reservation.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={reservation.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {reservation.seatName}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {reservation.date}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {reservation.startTime} - {reservation.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ₩{reservation.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        예약일: {reservation.reservationDate}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                    >
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
  );
};

export default ReservationSearch;
