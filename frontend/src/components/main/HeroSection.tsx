import Link from "next/link";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-brand-bold text-gray-900 mb-6">
            당신의 <span className="text-blue-600">아이디어</span>가
            <br />
            현실이 되는 공간
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-body">
            <span className="font-brand text-blue-600">Aperio</span>에서
            창의성과 생산성을 극대화하세요.
            <br />
            당신만의 완벽한 워크스페이스를 찾아보세요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/reservation"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaCalendarAlt className="mr-2" />
            지금 예약하기
            <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* 프로젝트 정보 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Full-Stack
            </div>
            <div className="text-gray-600">개발 프로젝트</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              10+
            </div>
            <div className="text-gray-600">주요 기능</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              React 19
            </div>
            <div className="text-gray-600">최신 기술</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Portfolio
            </div>
            <div className="text-gray-600">프로젝트</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
