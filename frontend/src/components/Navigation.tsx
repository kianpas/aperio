"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

interface Menu {
  menuId: number;
  name: string;
  menuUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface User {
  email: string;
  name?: string;
}

const Navigation = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/v1/menus");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data: Menu[] = await response.json();
        // DB에서 가져온 메뉴만 설정 (로그인 관련 메뉴 제외)
        setMenus(data.filter((menu) => menu.isActive));
      } catch (error) {
        console.error("Error fetching menus:", error);
        // 기본 콘텐츠 메뉴만 설정 (시스템 메뉴 제외)
        setMenus([
          {
            menuId: 1,
            name: "예약하기",
            menuUrl: "/reservation",
            sortOrder: 1,
            isActive: true,
          },
          {
            menuId: 2,
            name: "요금안내",
            menuUrl: "#pricing-section",
            sortOrder: 2,
            isActive: true,
          },
          {
            menuId: 3,
            name: "문의하기",
            menuUrl: "/contact",
            sortOrder: 3,
            isActive: true,
          },
          {
            menuId: 4,
            name: "FaQ",
            menuUrl: "/faq",
            sortOrder: 4,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // 클라이언트에서만 localStorage 접근
  useEffect(() => {
    // 사용자 인증 상태 확인 (실제 구현 시 인증 API 호출)
    // 임시로 localStorage나 쿠키에서 사용자 정보 확인
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch (error) {
          console.error("사용자 정보 파싱 오류:", error);
        }
      }
    }
  }, []);

  // 하드코딩 시스템 메뉴
  const systemMenus = {
    auth: user
      ? { type: "logout", label: "로그아웃" }
      : { type: "login", label: "로그인" },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // handleLogin 함수 제거 (Link 컴포넌트 사용으로 불필요)

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <nav className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-8">
      {/* 데스크톱 메뉴 */}
      <div className="hidden md:flex items-center space-x-8">
        {menus.map((menu) => (
          <Link
            key={menu.menuId}
            href={menu.menuUrl}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            {menu.name}
          </Link>
        ))}
      </div>

      {/* 시스템 메뉴 (인증 관련) */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          // 로그인된 사용자 메뉴
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaUser className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {user.name || user.email} 님
              </span>
            </div>
            <Link
              href="/mypage"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              마이페이지
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              로그아웃
            </button>
          </div>
        ) : (
          // 비로그인 사용자 메뉴
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>

      {/* 모바일 메뉴 버튼 */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden">
          <div className="px-4 py-6 space-y-4">
            {menus.map((menu) => (
              <Link
                key={menu.menuId}
                href={menu.menuUrl}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {menu.name}
              </Link>
            ))}

            {/* 모바일 시스템 메뉴 */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.name || user.email} 님
                    </span>
                  </div>
                  <Link
                    href="/mypage"
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
