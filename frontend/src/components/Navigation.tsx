"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import LoadingSpinner from "./ui/LoadingSpinner";

interface Menu {
  id: number;
  name: string;
  url: string;
  sortOrder: number;
  active: boolean;
}

interface NavigationProps {
  isMobileMenuOpen: boolean;
  mobileExtra?: ReactNode;
  initialMenus: Menu[];
}

export default function Navigation({
  isMobileMenuOpen,
  mobileExtra,
  initialMenus
}: NavigationProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
      
        setMenus(initialMenus);
      } catch (e) {
        console.error("Error fetching menus:", e);
        // Fallback menus
        setMenus([
          {
            id: 1,
            name: "예약하기",
            url: "/reservation",
            sortOrder: 1,
            active: true,
          },
          {
            id: 2,
            name: "문의하기",
            url: "/contact",
            sortOrder: 2,
            active: true,
          },
          {
            id: 3,
            name: "FaQ",
            url: "/faq",
            sortOrder: 3,
            active: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const onToggleMobileMenu = () => isMobileMenuOpen = !isMobileMenuOpen;

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
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.url}
            className="hover:text-blue-600 transition-colors duration-200"
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
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
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
        <div className="fixed top-16 left-0 right-0 w-full bg-white shadow-lg border-t border-gray-200 md:hidden z-[60] overflow-x-hidden">
          <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain touch-pan-y">
            {menus.map((menu) => (
              <Link
                key={menu.id}
                href={menu.url}
                className="block text-base text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={onToggleMobileMenu}
              >
                {menu.name}
              </Link>
            ))}
            {mobileExtra && (
              <div className="pt-4 border-t border-gray-200">{mobileExtra}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
