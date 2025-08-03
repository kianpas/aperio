'use client';

import Link from 'next/link';
import Navigation from './Navigation';

const Header= () => {
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

          {/* 네비게이션 */}
          <Navigation />
        </div>
      </div>
    </header>
  );
}

export default Header;