"use client";

import { useState } from "react";
import {
  FaImage,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaLink,
  FaCopy,
  FaTimes,
  FaClock,
  FaFile,
  FaVideo,
  FaUpload,
} from "react-icons/fa";

interface Content {
  id: string;
  title: string;
  type: "image" | "text" | "video";
  url: string;
  status: "published" | "draft" | "scheduled";
  author: string;
  createdAt: string;
  views: number;
}

const ContentPage = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const contents: Content[] = [
    {
      id: "C001",
      title: "공유 오피스 소개",
      type: "image",
      url: "/images/office-intro.jpg",
      status: "published",
      author: "관리자",
      createdAt: "2025-08-20",
      views: 1234,
    },
    {
      id: "C002",
      title: "8월 이벤트 배너",
      type: "image",
      url: "/images/event-banner.jpg",
      status: "scheduled",
      author: "마케팅팀",
      createdAt: "2025-08-21",
      views: 0,
    },
    {
      id: "C003",
      title: "이용 가이드",
      type: "text",
      url: "/guides/usage.pdf",
      status: "published",
      author: "고객지원팀",
      createdAt: "2025-08-19",
      views: 567,
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "게시중";
      case "draft":
        return "임시저장";
      case "scheduled":
        return "예약됨";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">콘텐츠 관리</h1>
        <p className="text-blue-100 text-lg">
          웹사이트의 모든 콘텐츠를 관리하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "전체 콘텐츠",
            value: "45",
            subValue: "지난달 대비 +5",
            icon: FaImage,
            color: "blue",
          },
          {
            title: "이번 달 조회수",
            value: "12,345",
            subValue: "일 평균 411회",
            icon: FaEye,
            color: "green",
          },
          {
            title: "예약된 콘텐츠",
            value: "8",
            subValue: "다음 7일 동안",
            icon: FaClock,
            color: "purple",
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

      {/* 필터 및 검색 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {["all", "image", "text", "video"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab === "all"
                    ? "전체"
                    : tab === "image"
                    ? "이미지"
                    : tab === "text"
                    ? "텍스트"
                    : "비디오"}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="콘텐츠 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />새 콘텐츠
          </button>
        </div>
      </div>

      {/* 콘텐츠 목록 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            전체 콘텐츠 ({contents.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  콘텐츠
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  조회수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {content.type === "image" ? (
                          <FaImage className="text-gray-600" />
                        ) : content.type === "text" ? (
                          <FaFile className="text-gray-600" />
                        ) : (
                          <FaVideo className="text-gray-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {content.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                        content.status
                      )}`}
                    >
                      {getStatusText(content.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="미리보기"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="URL 복사"
                      >
                        <FaLink />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="수정"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 콘텐츠 추가 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                새 콘텐츠 추가
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="콘텐츠 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  타입
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="image">이미지</option>
                  <option value="text">텍스트</option>
                  <option value="video">비디오</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  파일 업로드
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>파일 업로드</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">또는 드래그 앤 드롭</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage;
