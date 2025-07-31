import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 로고 및 설명 */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-blue-400">Aperio</h3>
              <p className="text-gray-400 mt-2">
                아이디어와 가능성을 열어주는 공간, 투명한 협업이 이루어지는 플랫폼
              </p>
            </div>
          </div>

          {/* 링크 섹션 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/reservation"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  예약하기
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing-section"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  요금안내
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">회사정보</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  회사소개
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  고객센터
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>(주)아페리오 | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
              <p>서울특별시 강남구 테헤란로 123, 8층</p>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Aperio. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
