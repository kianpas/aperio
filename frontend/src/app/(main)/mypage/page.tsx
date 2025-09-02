import Link from "next/link";
import {
  FaUser,
  FaCalendarCheck,
  FaCog,
  FaTicketAlt,
  FaReceipt,
} from "react-icons/fa";

export default function Mypage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
        <p className="text-blue-100 text-lg">
          대시보드에서 내 정보와 활동을 한눈에 확인하세요.
        </p>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 block md:hidden">
        <Link
          href="/mypage/profile"
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUser className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">프로필</h3>
          </div>
          <p className="text-gray-600">개인 정보와 연락처를 관리하세요.</p>
        </Link>

        <Link
          href="/mypage/reservations"
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCalendarCheck className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">
              예약 내역
            </h3>
          </div>
          <p className="text-gray-600">
            다가오는 예약과 지난 예약을 확인하세요.
          </p>
        </Link>

        <Link
          href="/mypage/settings"
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaCog className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">설정</h3>
          </div>
          <p className="text-gray-600">계정 및 알림 설정을 변경하세요.</p>
        </Link>
      </section>

      {/* KPIs (placeholders) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">다가오는 예약</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">—</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <FaCalendarCheck className="text-green-600" />
            </div>
          </div>
          <Link
            href="/mypage/reservations"
            className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            자세히 보기
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">보유 쿠폰</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">—</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <FaTicketAlt className="text-yellow-600" />
            </div>
          </div>
          <Link
            href="/mypage/plans"
            className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            자세히 보기
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">최근 결제</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">—</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaReceipt className="text-blue-600" />
            </div>
          </div>
          <Link
            href="/mypage/billing"
            className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            자세히 보기
          </Link>
        </div>
      </section>

      {/* Recent Activity (static placeholder) */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">최근 활동</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaCalendarCheck className="text-green-500 mr-3" />
            <span className="text-gray-700">예약이 완료되었습니다.</span>
            <span className="text-gray-500 text-sm ml-auto">2시간 전</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaTicketAlt className="text-yellow-500 mr-3" />
            <span className="text-gray-700">쿠폰이 발급되었습니다.</span>
            <span className="text-gray-500 text-sm ml-auto">어제</span>
          </div>
        </div>
      </section>
    </div>
  );
}
