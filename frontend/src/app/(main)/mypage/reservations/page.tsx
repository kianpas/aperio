
import { serverFetch } from "@/lib/http/server";
import { Reservation } from "@/types/reservation";

import ReservationList from "@/app/(main)/mypage/reservations/ReservationList";

const Reservations = async () => {
  const res = await serverFetch("/api/v1/reservations/my");
  const pageData = await res.json();
  const reservations: Reservation[] = Array.isArray(pageData?.content)
    ? (pageData.content as Reservation[])
    : [];
  const currentPage: number =
    typeof pageData?.page === "number" ? pageData.page : 0;
  const totalPages: number =
    typeof pageData?.totalPages === "number" ? pageData.totalPages : 0;
  const activeTab = "all";
  const searchTerm = "";

  // 임시 데이터 (실제로는 API에서 가져올 데이터)
  const reservationsSample: Reservation[] = [
    {
      id: 1,
      seatName: "회의실 A",
      date: "2024-02-05",
      startTime: "09:00",
      endTime: "12:00",
      status: "upcoming",
      price: 30000,
      reservationDate: "2024-01-28",
    },
    {
      id: 2,
      seatName: "데스크 #15",
      date: "2024-01-30",
      startTime: "13:00",
      endTime: "18:00",
      status: "completed",
      price: 15000,
      reservationDate: "2024-01-25",
    },
    {
      id: 3,
      seatName: "라운지 테이블",
      date: "2024-01-28",
      startTime: "10:00",
      endTime: "16:00",
      status: "cancelled",
      price: 20000,
      reservationDate: "2024-01-20",
    },
    {
      id: 4,
      seatName: "회의실 B",
      date: "2024-01-31",
      startTime: "14:00",
      endTime: "17:00",
      status: "in-progress",
      price: 25000,
      reservationDate: "2024-01-29",
    },
  ];

  


  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">예약내역</h1>
          <p className="text-gray-600 mt-1">
            나의 모든 예약 현황을 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* {[
          { label: "전체 예약", count: getTabCount("all"), color: "blue" },
          {
            label: "예정된 예약",
            count: getTabCount("upcoming"),
            color: "green",
          },
          {
            label: "완료된 예약",
            count: getTabCount("completed"),
            color: "purple",
          },
          {
            label: "취소된 예약",
            count: getTabCount("cancelled"),
            color: "red",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.count}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <FaCalendarAlt className={`text-xl text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))} */}
      </div>

      {/* 필터 및 검색 */}
      <ReservationList initialReservations={reservations} />

      {/* 예약 목록 */}
    

      {/* 페이지네이션 (필요시) */}
      {reservations.length > 0 && (
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
};

export default Reservations;
