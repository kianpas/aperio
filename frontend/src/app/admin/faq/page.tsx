"use client";

import { useState } from "react";
import {
  FaLifeRing,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaFilter,
  FaEye,
  FaArrowRight,
  FaCog,
  FaChartBar,
  FaChevronDown,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaLightbulb,
  FaSort,
  FaGripVertical,
  FaThumbsUp,
  FaThumbsDown,
  FaComments,
} from "react-icons/fa";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "reservation" | "payment" | "account" | "technical";
  isActive: boolean;
  order: number;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

const FAQPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: "F001",
      question: "예약은 어떻게 하나요?",
      answer: "홈페이지 상단의 '예약하기' 버튼을 클릭하시거나, 원하시는 날짜와 시간을 선택하여 예약하실 수 있습니다. 회원가입 후 이용 가능합니다.",
      category: "reservation",
      isActive: true,
      order: 1,
      viewCount: 1250,
      helpfulCount: 89,
      notHelpfulCount: 12,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-20",
    },
    {
      id: "F002",
      question: "결제 방법은 무엇이 있나요?",
      answer: "카카오페이, 신용카드, 계좌이체를 지원합니다. 모든 결제는 SSL 보안 연결을 통해 안전하게 처리됩니다.",
      category: "payment",
      isActive: true,
      order: 2,
      viewCount: 890,
      helpfulCount: 67,
      notHelpfulCount: 8,
      createdAt: "2024-01-20",
      updatedAt: "2024-02-15",
    },
    {
      id: "F003",
      question: "예약 취소는 언제까지 가능한가요?",
      answer: "예약 시작 시간 2시간 전까지 무료 취소가 가능합니다. 그 이후에는 취소 수수료가 발생할 수 있습니다.",
      category: "reservation",
      isActive: true,
      order: 3,
      viewCount: 756,
      helpfulCount: 45,
      notHelpfulCount: 5,
      createdAt: "2024-01-25",
      updatedAt: "2024-02-10",
    },
    {
      id: "F004",
      question: "회원가입은 필수인가요?",
      answer: "네, 예약 서비스 이용을 위해서는 회원가입이 필요합니다. 간편한 소셜 로그인(네이버, 카카오)도 지원합니다.",
      category: "account",
      isActive: true,
      order: 4,
      viewCount: 623,
      helpfulCount: 38,
      notHelpfulCount: 7,
      createdAt: "2024-02-01",
      updatedAt: "2024-02-05",
    },
  ];

  const stats = [
    { label: "전체 FAQ", value: "24", change: "+3", trend: "up" },
    { label: "활성 FAQ", value: "20", change: "+2", trend: "up" },
    { label: "총 조회수", value: "3.5K", change: "+12%", trend: "up" },
    { label: "도움됨 비율", value: "87%", change: "+3%", trend: "up" }
  ];

  const quickActions = [
    {
      title: "FAQ 분석",
      description: "자주 묻는 질문 패턴 분석",
      count: "상위 10개 질문",
      icon: FaChartBar,
      color: "blue",
      href: "/admin/analytics/faq"
    },
    {
      title: "카테고리 관리",
      description: "FAQ 카테고리 구조 관리",
      count: "5개 카테고리",
      icon: FaCog,
      color: "green",
      href: "/admin/faq/categories"
    },
    {
      title: "사용자 피드백",
      description: "FAQ 도움 여부 피드백 관리",
      count: "87% 만족도",
      icon: FaComments,
      color: "purple",
      href: "/admin/faq/feedback"
    }
  ];

  const categories = [
    { id: "general", label: "일반", icon: FaInfoCircle, color: "gray" },
    { id: "reservation", label: "예약", icon: FaQuestionCircle, color: "blue" },
    { id: "payment", label: "결제", icon: FaExclamationCircle, color: "green" },
    { id: "account", label: "계정", icon: FaLifeRing, color: "purple" },
    { id: "technical", label: "기술", icon: FaLightbulb, color: "orange" },
  ];

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* 상단 헤더 - Netflix 스타일 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ 관리</h1>
          <p className="text-gray-600 mt-2">자주 묻는 질문을 관리하여 고객 지원을 효율화합니다</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FaFilter />
            <span>필터</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            <span>새 FAQ</span>
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
                <span className="text-sm text-indigo-600 group-hover:text-indigo-700">
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
              placeholder="질문, 답변 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">전체 카테고리</option>
              {categories.map(category => (
                <option key={category.id} value={category.id} className="text-gray-900">{category.label}</option>
              ))}
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white">
              <option value="all" className="text-gray-900">전체 상태</option>
              <option value="active" className="text-gray-900">활성</option>
              <option value="inactive" className="text-gray-900">비활성</option>
            </select>
          </div>
        </div>
      </div>

      {/* FAQ 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              FAQ 목록 ({filteredFAQs.length}개)
            </h3>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <FaSort />
              <span>순서 변경</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const categoryInfo = getCategoryInfo(faq.category);
              const isExpanded = expandedFAQ === faq.id;
              
              return (
                <div
                  key={faq.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
                >
                  {/* FAQ 헤더 */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                          <FaGripVertical />
                        </div>
                        <div className={`p-2 rounded-lg bg-${categoryInfo.color}-100`}>
                          <categoryInfo.icon className={`text-${categoryInfo.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              faq.isActive 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {faq.isActive ? <FaCheckCircle className="w-3 h-3 mr-1" /> : <FaTimesCircle className="w-3 h-3 mr-1" />}
                              {faq.isActive ? "활성" : "비활성"}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700`}>
                              {categoryInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <FaEye />
                              <span>{faq.viewCount.toLocaleString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FaThumbsUp />
                              <span>{faq.helpfulCount}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FaThumbsDown />
                              <span>{faq.notHelpfulCount}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedFAQ(isExpanded ? null : faq.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEye />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <FaEdit />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* FAQ 답변 (확장 시) */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">답변</h4>
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>생성일: {faq.createdAt}</span>
                          <span>수정일: {faq.updatedAt}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>도움됨 비율:</span>
                          <span className="font-medium text-indigo-600">
                            {Math.round((faq.helpfulCount / (faq.helpfulCount + faq.notHelpfulCount)) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ 추가 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">새 FAQ 추가</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      질문
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="자주 묻는 질문을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      답변
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="질문에 대한 상세한 답변을 입력하세요"
                    />
                  </div>
                </div>
              </div>

              {/* 카테고리 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <category.icon className={`text-${category.color}-600`} />
                      <span className="text-sm text-gray-700">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 설정 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">FAQ 활성화</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      표시 순서
                    </label>
                    <input
                      type="number"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  FAQ 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;