import {
  FaCalendarAlt,
  FaChair,
  FaCreditCard,
  FaArrowRight,
} from "react-icons/fa";

import { serverFetch } from "@/lib/http/server";
import SeatSelector from "./SeatSelector";

async function getSeats() {
  const res = await serverFetch("/api/v1/seats");
  return res.ok ? res.json() : [];
}

const ReservationPage = async () => {
  const seats = await getSeats();
  console.log("seats from server =>", seats);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 간단한 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">공간 예약</h1>
              <p className="text-gray-700 mt-1">
                원하는 공간과 시간을 선택하세요
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-700">실시간 업데이트</div>
              <div
                className="text-sm font-medium text-gray-900"
                suppressHydrationWarning
              >
                {/* {mounted
                  ? new Intl.DateTimeFormat("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Seoul",
                    }).format(new Date())
                  : ""} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SeatSelector initialSeats={seats} />
    </div>
  );
};

export default ReservationPage;
