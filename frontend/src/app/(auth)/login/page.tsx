"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaUser,
  FaArrowRight,
  FaBuilding,
} from "react-icons/fa";
import { SiKakao, SiNaver } from "react-icons/si";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: 스프링 시큐리티 연동
    console.log("Login attempt:", formData);

    // 임시 로딩 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleOAuthLogin = (provider: "kakao" | "naver" | "google") => {
    // TODO: OAuth 로그인 연동
    console.log(`${provider} login attempt`);

    // 실제 구현 시 사용할 URL 예시
    // const oauthUrls = {
    //   kakao: "/oauth2/authorization/kakao",
    //   naver: "/oauth2/authorization/naver",
    //   google: "/oauth2/authorization/google",
    // };

    // window.location.href = oauthUrls[provider];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고 및 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <FaBuilding className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl brand-logo mb-2">Aperio</h1>
          <p className="text-gray-600">공유오피스 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                이메일
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* 로그인 유지 및 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">로그인 유지</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                비밀번호 찾기
              </Link>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>로그인</span>
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* 구분선 */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">또는</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* 소셜 로그인 */}
          <div className="space-y-3">
            {/* 카카오 로그인 */}
            <button
              onClick={() => handleOAuthLogin("kakao")}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <SiKakao className="text-xl" />
              <span>카카오로 로그인</span>
            </button>

            {/* 네이버 로그인 */}
            <button
              onClick={() => handleOAuthLogin("naver")}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <SiNaver className="text-xl" />
              <span>네이버로 로그인</span>
            </button>

            {/* 구글 로그인 */}
            <button
              onClick={() => handleOAuthLogin("google")}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl border border-gray-300 transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <FaGoogle className="text-xl text-red-500" />
              <span>구글로 로그인</span>
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                회원가입
              </Link>
            </p>
          </div>

          {/* 관리자 로그인 링크 */}
          <div className="mt-4 text-center">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1"
            >
              <FaLock className="text-xs" />
              <span>관리자 로그인</span>
            </Link>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Aperio. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terms" className="hover:text-gray-700">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
