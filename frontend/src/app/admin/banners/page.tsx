"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaImage,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaLink,
  FaCalendar,
  FaChartLine,
  FaDesktop,
  FaMobile,
  FaTablet,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaCog,
  FaChartBar,
  FaPlay,
  FaPause,
  FaStop,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaClock,
  FaMousePointer,
} from "react-icons/fa";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
  location: string;
  viewCount: number;
  clickCount: number;
  devices: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
}

const BannersPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const banners: Banner[] = [
    {
      id: "B1",
      title: "여름 특별 프로모션",
      imageUrl: "/banners/summer-promo.jpg",
      linkUrl: "/promotion/summer",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      isActive: true,
      order: 1,
      location: "main",
      viewCount: 1250,
      clickCount: 85,
      devices: {
        desktop: "/banners/summer-promo-desktop.jpg",
        tablet: "/banners/summer-promo-tablet.jpg",
        mobile: "/banners/summer-promo-mobile.jpg",
      },
    },
    {
      id: "B2",
      title: "신규 공간 오픈",
      imageUrl: "/banners/new-space.jpg",
      linkUrl: "/spaces/new",
      startDate: "2025-08-15",
      endDate: "2025-09-15",
      isActive: true,
      order: 2,
      location: "sub",
      viewCount: 850,
      clickCount: 42,
      devices: {
        desktop: "/banners/new-space-desktop.jpg",
        tablet: "/banners/new-space-tablet.jpg",
        mobile: "/banners/new-space-mobile.jpg",
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">배너 관리</h1>
          <p className="text-gray-600 mt-2">
            웹사이트의 배너와 프로모션을 관리하고 성과를 분석합니다
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter />
            <span>필터</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            <span>새 배너</span>
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "활성 배너", value: "5", change: "+1", trend: "up" },
          { label: "총 노출수", value: "12.5K", change: "+8%", trend: "up" },
          { label: "총 클릭수", value: "402", change: "+12%", trend: "up" },
          { label: "평균 CTR", value: "3.2%", change: "+0.5%", trend: "up" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 액션 카드 - Netflix/Spotify 스타일 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "배너 성과 분석",
              description: "클릭률, 노출수 등 상세 분석",
              count: "평균 CTR 3.2%",
              icon: FaChartBar,
              color: "blue",
              href: "/admin/analytics/banners",
            },
            {
              title: "A/B 테스트",
              description: "배너 버전별 성과 비교",
              count: "2개 테스트 진행중",
              icon: FaCog,
              color: "green",
              href: "/admin/banners/ab-test",
            },
            {
              title: "배너 스케줄",
              description: "예약된 배너 및 캠페인 관리",
              count: "3개 예약됨",
              icon: FaCalendar,
              color: "purple",
              href: "/admin/banners/schedule",
            },
          ].map((action, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={() => console.log(`Navigate to ${action.href}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${action.color}-100`}>
                  <action.icon
                    className={`text-2xl text-${action.color}-600`}
                  />
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{action.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {action.count}
                </span>
                <span className="text-sm text-pink-600 group-hover:text-pink-700">
                  관리하기 →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 검색 및 필터 바 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="배너 제목, 링크로 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">전체 위치</option>
              <option value="main" className="text-gray-900">메인 배너</option>
              <option value="sub" className="text-gray-900">서브 배너</option>
              <option value="popup" className="text-gray-900">팝업 배너</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white">
              <option value="all" className="text-gray-900">전체 상태</option>
              <option value="active" className="text-gray-900">활성</option>
              <option value="inactive" className="text-gray-900">비활성</option>
              <option value="scheduled" className="text-gray-900">예약됨</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === "desktop"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaDesktop />
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === "tablet"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaTablet />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === "mobile"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaMobile />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 배너 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              배너 목록 (
              {
                banners.filter((banner) =>
                  selectedLocation === "all"
                    ? true
                    : banner.location === selectedLocation
                ).length
              }
              개)
            </h3>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <FaEye />
              <span>미리보기</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners
              .filter((banner) =>
                selectedLocation === "all"
                  ? true
                  : banner.location === selectedLocation
              )
              .map((banner) => (
                <div
                  key={banner.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-pink-200 transition-all duration-200"
                >
                  {/* 배너 이미지 */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <Image
                      src={banner.devices[previewDevice]}
                      alt={banner.title}
                      width={600}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      {banner.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <FaCheckCircle className="w-3 h-3 mr-1" />
                          활성
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          <FaTimesCircle className="w-3 h-3 mr-1" />
                          비활성
                        </span>
                      )}
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {banner.location === "main"
                          ? "메인"
                          : banner.location === "sub"
                          ? "서브"
                          : "팝업"}
                      </span>
                    </div>
                  </div>

                  {/* 배너 정보 */}
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {banner.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FaLink className="text-gray-400" />
                          <span className="truncate">{banner.linkUrl}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCalendar className="text-gray-400" />
                          <span>
                            {banner.startDate} ~ {banner.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 성과 지표 */}
                    <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
                          <FaEye className="text-xs" />
                          <span className="text-xs">노출수</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {banner.viewCount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
                          <FaMousePointer className="text-xs" />
                          <span className="text-xs">클릭수</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {banner.clickCount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
                          <FaChartLine className="text-xs" />
                          <span className="text-xs">CTR</span>
                        </div>
                        <div className="text-lg font-semibold text-pink-600">
                          {(
                            (banner.clickCount / banner.viewCount) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEye />
                          <span>상세</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <FaEdit />
                          <span>수정</span>
                        </button>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          {banner.isActive ? <FaPause /> : <FaPlay />}
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 배너 추가 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">새 배너 추가</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      배너 제목
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="배너 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      링크 URL
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        시작일
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        종료일
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      노출 위치
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                      <option value="main">메인 배너</option>
                      <option value="sub">서브 배너</option>
                      <option value="popup">팝업 배너</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">활성화</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      데스크톱 이미지
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <FaDesktop className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500">
                            <span>이미지 업로드</span>
                            <input type="file" className="sr-only" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">1920x580px 권장</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      태블릿 이미지
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <FaTablet className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500">
                            <span>이미지 업로드</span>
                            <input type="file" className="sr-only" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">1024x400px 권장</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      모바일 이미지
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <FaMobile className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500">
                            <span>이미지 업로드</span>
                            <input type="file" className="sr-only" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">640x400px 권장</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 배너 미리보기 모달 */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">배너 미리보기</h2>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-2 rounded ${
                      previewDevice === "desktop"
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <FaDesktop />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("tablet")}
                    className={`p-2 rounded ${
                      previewDevice === "tablet"
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <FaTablet />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-2 rounded ${
                      previewDevice === "mobile"
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <FaMobile />
                  </button>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div
                className={`mx-auto border rounded-lg overflow-hidden ${
                  previewDevice === "desktop"
                    ? "max-w-[1920px]"
                    : previewDevice === "tablet"
                    ? "max-w-[1024px]"
                    : "max-w-[640px]"
                }`}
              >
                {banners
                  .filter((banner) =>
                    selectedLocation === "all"
                      ? true
                      : banner.location === selectedLocation
                  )
                  .map((banner) => (
                    <div key={banner.id} className="relative">
                      <Image
                        src={banner.devices[previewDevice]}
                        alt={banner.title}
                        width={400}
                        height={225}
                        className="w-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <h3 className="text-white font-medium">
                          {banner.title}
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersPage;
