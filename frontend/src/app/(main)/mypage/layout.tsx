'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/mypage', label: '대시보드', icon: '🏠' },
    { href: '/mypage/profile', label: '프로필', icon: '👤' },
    { href: '/mypage/reservations', label: '예약내역', icon: '📅' },
    { href: '/mypage/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
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
                    className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-blue-500 text-white shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-4 text-lg">{item.icon}</span>
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
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
