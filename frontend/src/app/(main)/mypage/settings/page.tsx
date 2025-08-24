"use client";

import { useState } from "react";
import {
  FaCog,
  FaBell,
  FaLock,
  FaSignOutAlt,
  FaUserCircle,
  FaToggleOn,
  FaToggleOff,
  FaChevronRight,
} from "react-icons/fa";

interface Setting {
  id: string;
  title: string;
  description: string;
  type: "toggle" | "action";
  value?: boolean;
  action?: () => void;
}

export default function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");

  const handleConfirm = () => {
    confirmAction();
    setShowConfirm(false);
  };

  const showConfirmDialog = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  const [settings, setSettings] = useState<Setting[]>([
    {
      id: "notification_all",
      title: "알림 전체 설정",
      description: "모든 알림을 받아보시겠습니까?",
      type: "toggle",
      value: true,
    },
    {
      id: "notification_reservation",
      title: "예약 알림",
      description: "예약 관련 알림을 받아보세요",
      type: "toggle",
      value: true,
    },
    {
      id: "notification_payment",
      title: "결제 알림",
      description: "결제 관련 알림을 받아보세요",
      type: "toggle",
      value: true,
    },
    {
      id: "notification_marketing",
      title: "마케팅 알림",
      description: "프로모션 및 이벤트 알림을 받아보세요",
      type: "toggle",
      value: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id
          ? { ...setting, value: !setting.value }
          : setting
      )
    );
  };

  const handleLogout = () => {
    showConfirmDialog("로그아웃 하시겠습니까?", () => {
      // 실제로는 로그아웃 API 호출이 필요합니다
      alert("로그아웃되었습니다.");
    });
  };

  const handleWithdraw = () => {
    showConfirmDialog(
      "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      () => {
        // 실제로는 회원 탈퇴 API 호출이 필요합니다
        alert("회원 탈퇴가 완료되었습니다.");
      }
    );
  };

  const getSettingCount = (type: string) => {
    switch(type) {
      case 'notifications': return settings.length;
      case 'enabled': return settings.filter(s => s.value).length;
      case 'disabled': return settings.filter(s => !s.value).length;
      case 'security': return 2; // 비밀번호 변경, 로그인 기록
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">설정</h1>
          <p className="text-gray-600 mt-1">계정 및 알림 설정을 관리하세요.</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '알림 설정', 
            count: getSettingCount('notifications'), 
            color: 'blue',
            description: '전체 알림 설정 항목'
          },
          { 
            label: '활성화됨', 
            count: getSettingCount('enabled'), 
            color: 'green',
            description: '현재 켜져있는 알림'
          },
          { 
            label: '비활성화됨', 
            count: getSettingCount('disabled'), 
            color: 'gray',
            description: '현재 꺼져있는 알림'
          },
          { 
            label: '보안 설정', 
            count: getSettingCount('security'), 
            color: 'red',
            description: '보안 관련 설정 항목'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <FaCog className={`text-xl text-${stat.color}-600`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* 설정 섹션 */}
      <div className="space-y-6">
        {/* 알림 설정 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaBell className="text-xl text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">알림 설정</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {setting.title}
                  </h3>
                  <p className="text-gray-500">{setting.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(setting.id)}
                  className="text-2xl"
                >
                  {setting.value ? (
                    <FaToggleOn className="text-blue-600" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 보안 설정 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaLock className="text-xl text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">보안 설정</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            <button
              onClick={() => alert("비밀번호 변경 페이지로 이동합니다.")}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  비밀번호 변경
                </h3>
                <p className="text-gray-500">
                  주기적인 비밀번호 변경을 권장합니다
                </p>
              </div>
              <FaChevronRight className="text-gray-400" />
            </button>
            <button
              onClick={() => alert("로그인 기록 페이지로 이동합니다.")}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  로그인 기록
                </h3>
                <p className="text-gray-500">
                  최근 로그인 기록을 확인하세요
                </p>
              </div>
              <FaChevronRight className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* 계정 관리 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaUserCircle className="text-xl text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">계정 관리</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            <button
              onClick={handleLogout}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-blue-600"
            >
              <div className="flex items-center">
                <FaSignOutAlt className="mr-3" />
                <span className="font-medium">로그아웃</span>
              </div>
              <FaChevronRight />
            </button>
            <button
              onClick={handleWithdraw}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-red-600"
            >
              <div className="flex items-center">
                <FaUserCircle className="mr-3" />
                <span className="font-medium">회원 탈퇴</span>
              </div>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">확인</h3>
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
