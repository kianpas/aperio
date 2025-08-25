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
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

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
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">배너 관리</h1>
        <p className="text-pink-100 text-lg">
          웹사이트의 배너와 프로모션을 관리하세요
        </p>
      </div>

      {/* 통계 및 성과 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "활성 배너",
            value: "5",
            subValue: "전체 8개",
            icon: FaImage,
            color: "pink",
          },
          {
            title: "현재 진행중",
            value: "3",
            subValue: "오늘 기준",
            icon: FaCalendar,
            color: "purple",
          },
          {
            title: "총 노출수",
            value: "12.5K",
            subValue: "지난 30일",
            icon: FaEye,
            color: "blue",
          },
          {
            title: "평균 CTR",
            value: "3.2%",
            subValue: "↑ 0.5%",
            icon: FaChartLine,
            color: "green",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
          </div>
        ))}
      </div>

      {/* 배너 관리 툴바 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            {[
              { id: "all", label: "전체 배너" },
              { id: "main", label: "메인 배너" },
              { id: "sub", label: "서브 배너" },
              { id: "popup", label: "팝업 배너" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedLocation(type.id)}
                className={`px-4 py-2 rounded-lg ${
                  selectedLocation === type.id
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FaEye className="mr-2" />
              배너 미리보기
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              <FaPlus className="mr-2" />
              새 배너 추가
            </button>
          </div>
        </div>
      </div>

      {/* 배너 목록 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              배너 목록 ({banners.length})
            </h2>
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
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {banners
            .filter(banner => 
              selectedLocation === "all" ? true : banner.location === selectedLocation
            )
            .map((banner) => (
            <div
              key={banner.id}
              className="p-6 hover:bg-gray-50"
            >
              <div className="grid grid-cols-12 gap-6">
                {/* 배너 이미지 미리보기 */}
                <div className="col-span-3">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={banner.devices[previewDevice]}
                      alt={banner.title}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* 배너 정보 */}
                <div className="col-span-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {banner.title}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      banner.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {banner.isActive ? "활성" : "비활성"}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <FaLink className="text-gray-400" />
                      <span>{banner.linkUrl}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="text-gray-400" />
                      <span>{banner.startDate} ~ {banner.endDate}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-6">
                    <div>
                      <span className="text-sm text-gray-500">노출수</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {banner.viewCount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">클릭수</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {banner.clickCount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">CTR</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {((banner.clickCount / banner.viewCount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 배너 컨트롤 */}
                <div className="col-span-3 flex items-start justify-end space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
                    {banner.isActive ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button className="p-2 hover:bg-blue-100 rounded text-blue-600">
                    <FaEdit />
                  </button>
                  <button className="p-2 hover:bg-red-100 rounded text-red-600">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                  .filter(banner => 
                    selectedLocation === "all" ? true : banner.location === selectedLocation
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
                      <h3 className="text-white font-medium">{banner.title}</h3>
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
