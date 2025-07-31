"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

interface Menu {
  menuNo: number;
  menuNm: string;
  menuUrl: string;
  menuSort: number;
  useAt: string;
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
    // 메뉴 데이터 가져오기 (Next.js 프록시 사용)
    fetch("/api/v1/menus")
      .then((response) => {
        console.log("Menu API Response Status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Menu[]) => {
        console.log("Menu data received:", data);
        setMenus(data);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
        console.log("Using fallback menu data");
        // 기본 메뉴 설정
        setMenus([
          {
            menuNo: 1,
            menuNm: "예약하기",
            menuUrl: "/reservation",
            menuSort: 1,
            useAt: "Y",
          },
          {
            menuNo: 2,
            menuNm: "요금안내",
            menuUrl: "#pricing-section",
            menuSort: 2,
            useAt: "Y",
          },
          {
            menuNo: 3,
            menuNm: "문의하기",
            menuUrl: "/contact",
            menuSort: 3,
            useAt: "Y",
          },
          {
            menuNo: 4,
            menuNm: "FaQ",
            menuUrl: "/faq",
            menuSort: 4,
            useAt: "Y",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    // 로그인 페이지로 이동
    window.location.href = "/login";
  };

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
            key={menu.menuNo}
            href={menu.menuUrl}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            {menu.menuNm}
          </Link>
        ))}
      </div>

      {/* 사용자 정보 / 로그인 버튼 */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaUser className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {user.name || user.email} 님
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            로그인
          </button>
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
                key={menu.menuNo}
                href={menu.menuUrl}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {menu.menuNm}
              </Link>
            ))}

            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.name || user.email} 님
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
