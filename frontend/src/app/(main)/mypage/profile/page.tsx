"use client";

import { useState } from "react";
// import Image from "next/image";
import { useUser } from "@/hooks/useUser";
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

const Profile = () => {
  const { profile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  // const [profileData, setProfileData] = useState({
  //   name: "김철수",
  //   email: "kim@example.com",
  //   phone: "010-1234-5678",
  //   joinDate: "2024-01-15",
  //   plan: "월 정기",
  //   profileImage: null as string | null,
  // });
  // const [isLoading, setIsLoading] = useState(false);
  // const [editData, setEditData] = useState({ ...profile });

  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  console.log("profile =>", profile);

  // if (!profile) {
  //   return <div>사용자 프로필 정보가 없습니다.</div>;
  // }

  const handleEdit = () => {
    setIsEditing(true);
    // setEditData({ ...profileData });
  };

  const handleSave = () => {
    // TODO: API 호출로 프로필 업데이트
    // setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(field, value);
    // setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const parseDate = (createdAt: string) => {
    return new Date(createdAt).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로필</h1>
          <p className="text-gray-600 mt-1">
            개인정보를 관리하고 수정할 수 있습니다.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaEdit />
            <span>수정</span>
          </button>
        )}
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
          <div className="flex items-center space-x-6">
            {/* <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
                {profileData.profileImage ? (
                  <Image
                    src={profileData.profileImage}
                    alt="프로필"
                    width={96}
                    height={96}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profileData.name.charAt(0)
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <FaCamera className="text-sm" />
                </button>
              )}
            </div> */}
            <div className="text-white">
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-blue-100 mt-1">{profile?.plan} 멤버</p>
              <div className="flex items-center mt-2 text-blue-100">
                <FaCalendarAlt className="mr-2" />
                <span>
                  가입일:{" "}
                  {profile?.createdAt ? parseDate(profile.createdAt) : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 프로필 정보 */}
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
                  // value={editData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {profile?.name}
                </div>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                이메일
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center justify-between">
                {profile?.email}
                <FaShieldAlt className="text-green-500" title="인증됨" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                이메일은 보안상 변경할 수 없습니다.
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
                  // value={editData.phoneNumber}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {profile?.phoneNumber}
                </div>
              )}
            </div>

            {/* 멤버십 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                멤버십 플랜
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  {/* {profileData.plan} */}
                </span>
              </div>
            </div>
          </div>

          {/* 수정 모드 버튼 */}
          {isEditing && (
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
              >
                <FaTimes />
                <span>취소</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
              >
                <FaSave />
                <span>저장</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 추가 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 계정 보안 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            계정 보안
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">비밀번호 변경</div>
              <div className="text-sm text-gray-500">
                계정 보안을 위해 정기적으로 변경하세요
              </div>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">2단계 인증</div>
              <div className="text-sm text-gray-500">추가 보안 설정</div>
            </button>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            알림 설정
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">예약 알림</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">마케팅 알림</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">시스템 알림</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
