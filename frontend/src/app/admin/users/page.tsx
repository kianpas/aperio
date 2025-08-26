'use client';

import { useState } from 'react';
import { 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaUserCog, 
  FaShieldAlt, 
  FaChartBar,
  FaArrowRight,
  FaUserPlus,
  FaFilter
} from 'react-icons/fa';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // 빠른 액션 카드 데이터
  const quickActions = [
    {
      title: "역할 관리",
      description: "사용자 역할 및 권한 설정",
      count: "15개 역할",
      icon: FaUserCog,
      color: "blue",
      href: "/admin/users/roles"
    },
    {
      title: "권한 설정", 
      description: "세부 권한 및 접근 제어",
      count: "8개 권한",
      icon: FaShieldAlt,
      color: "green",
      href: "/admin/users/permissions"
    },
    {
      title: "사용자 통계",
      description: "가입 및 활동 분석",
      count: "이번 달 +12%",
      icon: FaChartBar,
      color: "purple",
      href: "/admin/analytics/users"
    }
  ];

  // 통계 데이터
  const stats = [
    { label: "전체 사용자", value: "1,234", change: "+12%", trend: "up" },
    { label: "활성 사용자", value: "1,156", change: "+8%", trend: "up" },
    { label: "이번 달 신규", value: "89", change: "+24%", trend: "up" },
    { label: "정지된 사용자", value: "78", change: "-5%", trend: "down" }
  ];

  const users = [
    {
      id: 1,
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      plan: '월 정기',
      status: '활성',
      joinDate: '2024-01-15',
      lastLogin: '2시간 전'
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-9876-5432',
      plan: '시간제',
      status: '활성',
      joinDate: '2024-02-20',
      lastLogin: '1일 전'
    },
    {
      id: 3,
      name: '박민수',
      email: 'park@example.com',
      phone: '010-5555-1234',
      plan: '월 정기',
      status: '정지',
      joinDate: '2024-01-10',
      lastLogin: '1주일 전'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-600 mt-2">총 1,234명의 사용자를 관리하고 모니터링합니다</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter />
            <span>필터</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            <FaUserPlus />
            <span>새 사용자</span>
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
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
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
              onClick={() => console.log(`Navigate to ${action.href}`)}
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
              placeholder="사용자 이름, 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">전체 상태</option>
              <option value="active" className="text-gray-900">활성</option>
              <option value="inactive" className="text-gray-900">정지</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white">
              <option className="text-gray-900">전체 플랜</option>
              <option className="text-gray-900">월 정기</option>
              <option className="text-gray-900">시간제</option>
            </select>
          </div>
        </div>
      </div>

      {/* 사용자 목록 - 개선된 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">사용자 목록</h3>
            <span className="text-sm text-gray-500">{users.length}명의 사용자</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">플랜</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마지막 로그인</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      user.status === '활성' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        user.status === '활성' ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors">
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
    </div>
  );
};

export default UsersPage;