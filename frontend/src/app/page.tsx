'use client';

import { useEffect, useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaHandshake, 
  FaUsers, 
  FaCoffee,
  FaUser,
  FaCouch,
  FaCog,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaMap,
  FaTrain,
  FaBus,
  FaParking
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 호출하여 배너 데이터 가져오기 (Next.js 프록시 사용)
    fetch('/api/main')
      .then(response => {
        console.log('Main API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MainDataResponse) => {
        console.log('Main data received:', data);
        setBanners(data.bannerList);
        setLoading(false);
      })
      .catch(error => {
        console.error('메인 데이터 조회 실패:', error);
        // 임시 배너 데이터 설정
        setBanners([
          {
            bNo: 1,
            bTitle: '임시 배너',
            bImageUrl: '/img/slide1.jpg',
            startDt: '2025-01-01',
            endDt: '2025-12-31',
            register: '관리자',
            createDt: '2025-01-28',
            useAt: 'Y'
          }
        ]);
        setLoading(false);
      });
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Hero Section - Banner Slider */}
      <section className="relative h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.bNo}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.bImageUrl}
              alt={banner.bTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">성장을 위한 유연한 공간</h1>
                <p className="text-xl md:text-2xl mb-8">강남 중심에서 당신의 비즈니스를 시작하세요.</p>
                <a
                  href="#pricing-section"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                >
                  요금제 보기
                </a>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              BetWeen을 선택해야 하는 이유
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              단순한 공간을 넘어, 당신의 성공을 위한 최적의 환경을 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaMapMarkerAlt,
                title: '최적의 접근성',
                description: '신논현역 도보 5분 거리의 편리한 교통'
              },
              {
                icon: FaHandshake,
                title: '유연한 멤버십',
                description: '시간제부터 월 단위까지, 필요에 맞춘 요금제'
              },
              {
                icon: FaUsers,
                title: '활발한 커뮤니티',
                description: '다양한 분야의 전문가들과 네트워킹 기회'
              },
              {
                icon: FaCoffee,
                title: '편리한 시설',
                description: '고속 인터넷, OA 기기, 휴게 공간 완비'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <benefit.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/img/slide2.jpg"
                alt="공유오피스 소개"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                당신의 비즈니스를 위한 최고의 공간
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                BetWeen은 단순한 오피스를 넘어 창의적이고 유연한 업무 환경을 제공합니다.<br />
                스타트업, 프리랜서, 크리에이터 모두를 위한 맞춤형 공유 오피스입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              제공하는 서비스
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              편리하고 유연한 업무 환경을 위해 다양한 공간과 혜택을 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaUser,
                title: '프라이빗 오피스',
                description: '1~6인 팀을 위한 독립형 오피스 공간'
              },
              {
                icon: FaCouch,
                title: '공용 라운지',
                description: '자유롭게 소통하고 일할 수 있는 열린 공간'
              },
              {
                icon: FaCog,
                title: '회의실 예약',
                description: '필요할 때 간편하게 예약 가능한 회의실'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group hover:-translate-y-2 transition-transform"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
                  <service.icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">요금</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              사용자의 시간에 맞춘 합리적인 요금을 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan - Recommended */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-500 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  추천
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">월</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">99,000원</span>
                  <span className="text-gray-600 ml-2">/1개월</span>
                </div>
                <p className="text-gray-600 mb-8">월 정기 이용권</p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    '기간 내 무제한 이용',
                    '개인 사물함 제공 (옵션)',
                    '회의실 월 5시간 무료'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a
                  href="/signup?plan=monthly"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block text-center"
                >
                  지금 시작하기
                </a>
              </div>
            </div>

            {/* Hourly Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">기본</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">2,000원</span>
                  <span className="text-gray-600 ml-2">/1시간</span>
                </div>
                <p className="text-gray-600 mb-8">시간제 후불 이용</p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    '기본 1시간 이용',
                    '공용 라운지 이용 가능'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a
                  href="/signup?plan=hourly"
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block text-center"
                >
                  자세히 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            무엇이든 문의하세요
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            입주 상담, 제휴, 서비스 관련 문의는 아래 연락처로 편하게 남겨주세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: FaPhone, text: '02-123-4567' },
              { icon: FaEnvelope, text: 'support@between.com' },
              { icon: FaMap, text: '서울시 강남구 테헤란로 123' }
            ].map((contact, index) => (
              <div key={index} className="flex items-center justify-center space-x-3">
                <contact.icon className="w-6 h-6 text-blue-600" />
                <span className="text-gray-700 font-medium">{contact.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              찾아오시는 길
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              신논현역 3번 출구에서 도보 5분 거리에 위치하고 있습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              {[
                {
                  icon: FaTrain,
                  title: '지하철',
                  description: '9호선/신분당선 신논현역 3번 출구 (300m)'
                },
                {
                  icon: FaBus,
                  title: '버스',
                  description: '신논현역 정류장 (다수 노선)'
                },
                {
                  icon: FaParking,
                  title: '주차',
                  description: '건물 내 주차 가능 (유료, 방문 시 문의)'
                }
              ].map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                    <p className="text-gray-600">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
                <p className="text-gray-500">카카오맵 API 연동 예정</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
