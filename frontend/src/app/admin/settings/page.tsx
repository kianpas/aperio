"use client";

import { useState } from "react";
import {
  FaCog,
  FaUser,
  FaLock,
  FaBell,
  FaDatabase,
  FaShieldAlt,
  FaEnvelope,
  FaGlobe,
  FaCalendarAlt,
  FaCreditCard,
  FaKey,
  FaServer,
  FaCode,
  FaDownload,
  FaUpload,
  FaTrash,
  FaEdit,
  FaPlus,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaChartBar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaHistory,
  FaFileAlt,
} from "react-icons/fa";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showBackupModal, setShowBackupModal] = useState(false);

  const tabs = [
    { id: "general", label: "일반 설정", icon: FaCog },
    { id: "users", label: "사용자 설정", icon: FaUser },
    { id: "security", label: "보안 설정", icon: FaShieldAlt },
    { id: "notifications", label: "알림 설정", icon: FaBell },
    { id: "payment", label: "결제 설정", icon: FaCreditCard },
    { id: "system", label: "시스템 설정", icon: FaServer },
  ];

  const stats = [
    { label: "시스템 가동률", value: "99.9%", change: "+0.1%", trend: "up" },
    { label: "활성 세션", value: "24", change: "+3", trend: "up" },
    { label: "저장소 사용량", value: "67%", change: "+5%", trend: "up" },
    { label: "마지막 백업", value: "2시간 전", change: "성공", trend: "stable" }
  ];

  const quickActions = [
    {
      title: "시스템 백업",
      description: "데이터베이스 및 설정 백업",
      count: "마지막: 2시간 전",
      icon: FaDatabase,
      color: "blue",
      action: () => setShowBackupModal(true)
    },
    {
      title: "보안 검사",
      description: "시스템 보안 상태 점검",
      count: "마지막: 1일 전",
      icon: FaShieldAlt,
      color: "green",
      action: () => console.log("Security scan")
    },
    {
      title: "시스템 로그",
      description: "시스템 활동 로그 확인",
      count: "24시간 로그",
      icon: FaFileAlt,
      color: "purple",
      action: () => console.log("View logs")
    }
  ];

  const systemInfo = [
    { label: "서버 버전", value: "Ubuntu 22.04 LTS" },
    { label: "Java 버전", value: "OpenJDK 17.0.2" },
    { label: "데이터베이스", value: "PostgreSQL 14.5" },
    { label: "Redis 버전", value: "Redis 7.0.4" },
    { label: "메모리 사용량", value: "4.2GB / 8GB" },
    { label: "디스크 사용량", value: "45GB / 100GB" },
  ];

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
          <p className="text-gray-600 mt-2">시스템 환경을 설정하고 관리합니다</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaHistory />
            <span>변경 이력</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            <FaSync />
            <span>설정 저장</span>
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
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
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              onClick={action.action}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${action.color}-100`}>
                  <action.icon className={`text-2xl text-${action.color}-600`} />
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{action.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{action.count}</span>
                <span className="text-sm text-blue-600 group-hover:text-blue-700">
                  실행하기 →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">일반 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사이트 이름
                  </label>
                  <input
                    type="text"
                    defaultValue="Aperio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사이트 설명
                  </label>
                  <input
                    type="text"
                    defaultValue="공유오피스 예약 시스템"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기본 언어
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시간대
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">보안 설정</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">2단계 인증</h4>
                    <p className="text-sm text-gray-600">관리자 계정 보안 강화</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">세션 타임아웃</h4>
                    <p className="text-sm text-gray-600">비활성 시 자동 로그아웃</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="30">30분</option>
                    <option value="60">1시간</option>
                    <option value="120">2시간</option>
                    <option value="0">비활성화</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">IP 접근 제한</h4>
                    <p className="text-sm text-gray-600">특정 IP에서만 관리자 접근 허용</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">시스템 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemInfo.map((info, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-700">{info.label}</span>
                    <span className="text-gray-900">{info.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">시스템 작업</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaSync />
                    <span>캐시 초기화</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaDatabase />
                    <span>데이터베이스 최적화</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaDownload />
                    <span>로그 다운로드</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <FaTrash />
                    <span>임시 파일 정리</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 백업 모달 */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">시스템 백업</h2>
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimesCircle />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">데이터베이스</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">시스템 설정</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">업로드된 파일</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  백업 시작
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;