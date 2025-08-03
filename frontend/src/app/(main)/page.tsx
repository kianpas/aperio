"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaCoffee,
  FaUser,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaStar,
  FaWifi,
  FaDesktop,
  FaCalendarAlt,
  FaShieldAlt,
  FaPlay,
  FaCog,
} from "react-icons/fa";

interface Banner {
  bNo: number;
  bTitle: string;
  bImageUrl: string;
  startDt: string;
  endDt: string;
  register: string;
  createDt: string;
  useAt: string;
}

interface MainDataResponse {
  bannerList: Banner[];
  message: string;
}

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/v1/main");
        if (response.ok) {
          const data: MainDataResponse = await response.json();
          setBanners(data.bannerList);
        }
      } catch (error) {
        console.error("메인 데이터 조회 실패:", error);
        setBanners([
          {
            bNo: 1,
            bTitle: "Welcome to Aperio",
            bImageUrl: "/img/slide1.jpg",
            startDt: "2025-01-01",
            endDt: "2025-12-31",
            register: "관리자",
            createDt: "2025-01-28",
            useAt: "Y",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
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
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-brand-bold text-gray-900 mb-4">
              왜 <span className="text-blue-600 font-brand-bold">Aperio</span>를
              선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              최고의 업무 환경을 위한 모든 것이 준비되어 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaWifi className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                초고속 인터넷
              </h3>
              <p className="text-gray-600">
                기가비트 속도의 안정적인 인터넷 환경
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaDesktop className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                프리미엄 장비
              </h3>
              <p className="text-gray-600">최신 모니터와 업무용 장비 완비</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-amber-50 hover:bg-amber-100 transition-colors">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCoffee className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                무제한 커피
              </h3>
              <p className="text-gray-600">
                프리미엄 원두로 만든 무제한 커피 서비스
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                24시간 보안
              </h3>
              <p className="text-gray-600">
                안전한 업무 환경을 위한 24시간 보안 시스템
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              다양한 공간, 무한한 가능성
            </h2>
            <p className="text-xl text-gray-600">
              당신의 업무 스타일에 맞는 완벽한 공간을 찾아보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
              <div className="h-2 bg-blue-600"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <FaUser className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  개인 작업 공간
                </h3>
                <p className="text-gray-600 mb-6">
                  집중이 필요한 개인 업무를 위한 조용한 공간
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-500 mr-2" />
                    개인 책상
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-500 mr-2" />
                    고속 인터넷
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-500 mr-2" />
                    개인 사물함
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    2,000원/시간
                  </span>
                  <Link
                    href="/reservation"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    예약하기
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
              <div className="h-2 bg-purple-600"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <FaUsers className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  팀 협업 공간
                </h3>
                <p className="text-gray-600 mb-6">
                  팀 프로젝트와 회의를 위한 협업 공간
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-purple-500 mr-2" />
                    화이트보드
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-purple-500 mr-2" />
                    프로젝터
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-purple-500 mr-2" />
                    회의 테이블
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    8,000원/시간
                  </span>
                  <Link
                    href="/reservation"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    예약하기
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
              <div className="h-2 bg-green-600"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <FaPhone className="text-2xl text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  프라이빗 통화
                </h3>
                <p className="text-gray-600 mb-6">
                  중요한 통화를 위한 방음 부스
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    완벽 방음
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    편안한 의자
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    개인 공간
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    1,500원/시간
                  </span>
                  <Link
                    href="/reservation"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    예약하기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              포트폴리오 프로젝트 소개
            </h2>
            <p className="text-xl text-gray-600">
              이 프로젝트는 최신 기술 스택으로 구현된 공유 오피스 예약
              시스템입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaDesktop className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Frontend
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <FaCheckCircle className="text-blue-500 mr-2 text-sm" />
                  Next.js 15 (App Router)
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-blue-500 mr-2 text-sm" />
                  React 19 + TypeScript
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-blue-500 mr-2 text-sm" />
                  Tailwind CSS 4
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-blue-500 mr-2 text-sm" />
                  반응형 디자인
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaCog className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Backend
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                  Spring Boot 3.4.4
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                  Java 17 + JPA
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                  MySQL + Redis
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                  Spring Security
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                주요 기능
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <FaCheckCircle className="text-purple-500 mr-2 text-sm" />
                  실시간 좌석 예약
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-purple-500 mr-2 text-sm" />
                  관리자 대시보드
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-purple-500 mr-2 text-sm" />
                  결제 시스템 연동
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-purple-500 mr-2 text-sm" />
                  소셜 로그인
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
              <FaMapMarkerAlt className="mr-2" />
              포트폴리오 프로젝트 • 실제 서비스 아님
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              합리적인 가격, 최고의 가치
            </h2>
            <p className="text-xl text-gray-600">
              당신의 라이프스타일에 맞는 요금제를 선택하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  시간제
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    2,000원
                  </span>
                  <span className="text-lg text-gray-600">/시간</span>
                </div>
                <p className="text-gray-600">필요한 시간만큼 자유롭게</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  <span className="text-gray-700">기본 시설 이용</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  <span className="text-gray-700">Wi-Fi 무제한</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  <span className="text-gray-700">커피 1잔 제공</span>
                </li>
              </ul>
              <Link
                href="/reservation"
                className="block w-full text-center py-3 px-6 rounded-xl font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                시작하기
              </Link>
            </div>

            <div className="relative bg-blue-600 text-white rounded-3xl p-8 shadow-2xl scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                  가장 인기
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">일일권</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    10,000원
                  </span>
                  <span className="text-lg text-blue-100">/일</span>
                </div>
                <p className="text-blue-100">하루 종일 자유롭게 이용</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-blue-200" />
                  <span className="text-white">모든 시설 이용</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-blue-200" />
                  <span className="text-white">Wi-Fi 무제한</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-blue-200" />
                  <span className="text-white">커피 무제한</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-blue-200" />
                  <span className="text-white">회의실 1시간 무료</span>
                </li>
              </ul>
              <Link
                href="/reservation"
                className="block w-full text-center py-3 px-6 rounded-xl font-semibold transition-colors bg-white text-blue-600 hover:bg-gray-100"
              >
                시작하기
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  월정액
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    99,000원
                  </span>
                  <span className="text-lg text-gray-600">/월</span>
                </div>
                <p className="text-gray-600">무제한 이용 + 프리미엄 혜택</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  <span className="text-gray-700">모든 시설 무제한</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  <span className="text-gray-700">전용 사물함</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  <span className="text-gray-700">회의실 우선 예약</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  <span className="text-gray-700">네트워킹 이벤트 참여</span>
                </li>
              </ul>
              <Link
                href="/reservation"
                className="block w-full text-center py-3 px-6 rounded-xl font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            당신의 아이디어가 현실이 되는 순간을 경험해보세요.{" "}
            <span className="font-brand text-blue-200">Aperio</span>에서 새로운
            가능성을 발견하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <FaCalendarAlt className="mr-2" />
              무료 체험 예약
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              <FaPhone className="mr-2" />
              상담 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
