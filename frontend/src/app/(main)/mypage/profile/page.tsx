"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { accountAPI } from "@/lib/api/account";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

type EditData = { name: string; phoneNumber: string };

function formatJoinedAt(value: unknown): string {
  if (!value) return "";
  try {
    return new Date(value as any).toLocaleString();
  } catch {
    return String(value);
  }
}

export default function Profile() {
  const { profile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    name: "",
    phoneNumber: "",
  });

  const joinedAt = formatJoinedAt(profile?.createdAt);

  useEffect(() => {
    if (profile && isEditing) {
      setEditData({
        name: profile.name ?? "",
        phoneNumber: profile.phoneNumber ?? "",
      });
    }
  }, [profile, isEditing]);

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => setIsEditing(false);
  const handleChange = (field: keyof EditData, value: string) =>
    setEditData((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    if (!editData.name.trim()) {
      alert("이름을 입력해 주세요.");
      return;
    }
    setSaving(true);
    try {
      await accountAPI.updateProfile({
        name: editData.name.trim(),
        phoneNumber: editData.phoneNumber.trim(),
      });

      setIsEditing(false);
      alert("변경사항이 저장되었습니다.");
    } catch {
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로필</h1>
          <p className="text-gray-600 mt-1">
            계정 기본 정보를 확인하고 수정할 수 있어요.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={startEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaEdit /> <span>편집</span>
          </button>
        )}
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
          <div className="text-white">
            <h2 className="text-2xl font-bold">{profile?.name || "사용자"}</h2>
            <div className="flex items-center mt-2 text-blue-100">
              <FaCalendarAlt className="mr-2" /> <span>가입일: {joinedAt}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                이름
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center">
                  {profile?.name || "-"}
                </div>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                이메일
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center justify-between min-h-[48px]">
                {profile?.email || "-"}
                <FaShieldAlt className="text-green-500" title="인증됨" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                이메일은 보안을 위해 변경할 수 없어요.
              </p>
            </div>

          {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />
                전화번호
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center">
                  {profile?.phoneNumber || "-"}
                </div>
              )}
            </div>

             {/* 멤버십 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                멤버십
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center">
                -
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-60"
              >
                <FaTimes /> <span>취소</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
              >
                <FaSave /> <span>{saving ? "저장 중..." : "저장"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 보안/알림 설정은 설정 페이지에서 관리합니다. */}
    </div>
  );
}
