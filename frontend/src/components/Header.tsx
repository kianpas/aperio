"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "./Navigation";
import { useAuth } from "@/hooks/useAuth";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function Header() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
       console.error("로그아웃 실패:", error);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const UserInfo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      <FaUser className="w-4 h-4 text-gray-600" />
      <span className="text-sm text-gray-700 font-semibold">{user?.name}</span>
    </div>
  );

  const AuthenticatedMenu = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? "space-y-3" : "flex items-center gap-4"}>
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
            : "bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold"
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
    <div className={isMobile ? "space-y-2" : "flex items-center gap-3"}>
      <Link
        href="/login"
        className={`font-medium transition-colors duration-200 ${
          isMobile
            ? "block w-full text-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
            : "text-sm text-gray-600 hover:text-blue-600 font-medium"
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
            : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        }`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
       회원가입
      </Link>
    </div>
  );

  const mobileAuthArea = loading ? (
    <div className="py-2">
      <LoadingSpinner size="sm" />
    </div>
  ) : isAuthenticated ? (
    <AuthenticatedMenu isMobile />
  ) : (
    <UnauthenticatedMenu isMobile />
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
          <div className="flex items-center gap-8 relative">
            <Navigation
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={toggleMobileMenu}
              mobileExtra={mobileAuthArea}
            />

                  {/* 데스크톱 인증 영역 */}
            <div className="hidden md:flex items-center gap-4">
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
      </div>
    </header>
  );
}
