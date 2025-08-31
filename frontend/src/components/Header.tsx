"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "./Navigation";
import { useAuth } from "@/hooks/useAuth";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "./ui/LoadingSpinner";

const Header = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  console.log("user =>", user);
  console.log("user =>", user?.name);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 사용자 정보 표시 컴포넌트
  const UserInfo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <FaUser className="w-4 h-4 text-gray-600" />
      <span className="text-sm text-gray-700 font-medium">{user?.name}님</span>
    </div>
  );

  // 인증된 사용자 메뉴
  const AuthenticatedMenu = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? "space-y-3" : "flex items-center space-x-4"}>
      <UserInfo />
      <Link
        href="/mypage"
        className={`text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
          isMobile ? "block" : ""
        }`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        마이페이지
      </Link>
      <button
        onClick={handleLogout}
        className={`text-sm transition-colors duration-200 ${
          isMobile
            ? "block text-gray-600 hover:text-gray-800"
            : "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
        }`}
      >
        로그아웃
      </button>
    </div>
  );

  // 비인증 사용자 메뉴
  const UnauthenticatedMenu = ({
    isMobile = false,
  }: {
    isMobile?: boolean;
  }) => (
    <div className={isMobile ? "space-y-2" : "flex items-center space-x-3"}>
      <Link
        href="/login"
        className={`font-medium transition-colors duration-200 ${
          isMobile
            ? "block w-full text-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
            : "text-gray-600 hover:text-blue-600"
        }`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        로그인
      </Link>
      <Link
        href="/signup"
        className={`font-medium transition-colors duration-200 ${
          isMobile
            ? "block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        }`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        회원가입
      </Link>
    </div>
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl brand-logo hover:scale-105 transition-all duration-300"
            >
              Aperio
            </Link>
          </div>

          {/* 네비게이션 + 인증 */}
          <div className="flex items-center space-x-8">
            <Navigation
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={toggleMobileMenu}
            />

            {/* 데스크톱 인증 영역 */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : isAuthenticated ? (
                <AuthenticatedMenu />
              ) : (
                <UnauthenticatedMenu />
              )}
            </div>
          </div>
        </div>

        {/* 모바일 인증 영역 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : isAuthenticated ? (
              <AuthenticatedMenu isMobile />
            ) : (
              <UnauthenticatedMenu isMobile />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
