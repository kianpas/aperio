"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import LoadingSpinner from "./ui/LoadingSpinner";

interface Menu {
  menuId: number;
  name: string;
  menuUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface NavigationProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const Navigation = ({
  isMobileMenuOpen,
  onToggleMobileMenu,
}: NavigationProps) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/v1/menus");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data: Menu[] = await response.json();
        setMenus(data.filter((menu) => menu.isActive));
      } catch (error) {
        console.error("Error fetching menus:", error);
        // 기본 메뉴 설정
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

  if (loading) {
    return (
      <nav className="flex items-center space-x-4">
        <LoadingSpinner size="sm" />
      </nav>
    );
  }

  return (
    <>
      {/* 데스크톱 메뉴 */}
      <nav className="hidden md:flex items-center space-x-8">
        {menus.map((menu) => (
          <Link
            key={menu.menuId}
            href={menu.menuUrl}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            {menu.name}
          </Link>
        ))}
      </nav>

      {/* 모바일 메뉴 버튼 */}
      <div className="md:hidden">
        <button
          onClick={onToggleMobileMenu}
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-40">
          <div className="px-4 py-6 space-y-4">
            {menus.map((menu) => (
              <Link
                key={menu.menuId}
                href={menu.menuUrl}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={onToggleMobileMenu}
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
