"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaCreditCard,
  FaTag,
  FaPhone,
  FaGift,
  FaCog,
} from "react-icons/fa";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/mypage", label: "대시보드", icon: FaHome },
    { href: "/mypage/profile", label: "프로필", icon: FaUser },
    { href: "/mypage/reservations", label: "예약내역", icon: FaCalendarAlt },
    { href: "/mypage/billing", label: "결제내역", icon: FaCreditCard },
    { href: "/mypage/plans", label: "요금제 관리", icon: FaTag },
    { href: "/mypage/inquiries", label: "문의내역", icon: FaPhone },
    { href: "/mypage/rewards", label: "쿠폰/혜택", icon: FaGift },
    { href: "/mypage/settings", label: "설정", icon: FaCog },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4">
            마이페이지
          </h2>
          <nav>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                      pathname === item.href
                        ? "bg-blue-500 text-white shadow-md transform scale-105"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
                    }`}
                  >
                    <item.icon
                      className={`mr-4 text-lg ${
                        pathname === item.href
                          ? "text-white"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8 bg-white">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
