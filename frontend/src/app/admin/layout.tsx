"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaChair,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaBell,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "대시보드", icon: FaTachometerAlt },
    { href: "/admin/users", label: "사용자 관리", icon: FaUsers },
    { href: "/admin/reservations", label: "예약 관리", icon: FaCalendarAlt },
    { href: "/admin/seats", label: "좌석 관리", icon: FaChair },
    { href: "/admin/analytics", label: "통계 분석", icon: FaChartBar },
    { href: "/admin/inquiries", label: "문의 관리", icon: FaQuestionCircle },
    { href: "/admin/settings", label: "시스템 설정", icon: FaCog },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 관리자 사이드바 */}
      <aside className="w-64 bg-slate-800 shadow-xl">
        <div className="p-6">
          {/* 관리자 헤더 */}
          <div className="flex items-center mb-8 pb-6 border-b border-slate-700">
            <div className="bg-blue-600 p-3 rounded-xl">
              <FaUserShield className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-white font-bold text-lg">관리자</h2>
              <p className="text-slate-400 text-sm">Aperio Admin</p>
            </div>
          </div>

          {/* 메뉴 네비게이션 */}
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                      pathname === item.href
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 text-lg ${
                        pathname === item.href
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 하단 액션 */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <button className="flex items-center w-full p-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl transition-all duration-200">
              <FaBell className="mr-3 text-lg" />
              <span className="font-medium">알림</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                3
              </span>
            </button>
            <button className="flex items-center w-full p-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 mt-2">
              <FaSignOutAlt className="mr-3 text-lg" />
              <span className="font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        {/* 상단 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                관리자 대시보드
              </h1>
              <p className="text-gray-600 mt-1">
                Aperio 공유오피스 관리 시스템
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaUserShield className="text-white text-sm" />
                </div>
                <span className="text-gray-700 font-medium">관리자</span>
              </div>
            </div>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
