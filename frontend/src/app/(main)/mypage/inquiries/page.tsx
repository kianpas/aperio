"use client";

import { useState } from "react";
import { 
  FaPhone, 
  FaSearch, 
  FaPlus, 
  FaComments,
  FaPaperPlane,
  FaPaperclip
} from "react-icons/fa";

interface Inquiry {
  id: string;
  title: string;
  content: string;
  category: string;
  status: "waiting" | "answered" | "completed";
  date: string;
  answers?: {
    content: string;
    isAdmin: boolean;
    date: string;
  }[];
}

const sampleInquiries: Inquiry[] = [
  {
    id: "Q001",
    title: "회의실 예약 취소 문의",
    content: "내일 예약한 회의실을 취소하고 싶은데 환불 규정이 어떻게 되나요?",
    category: "예약",
    status: "answered",
    date: "2025-08-21",
    answers: [
      {
        content: "안녕하세요. 24시간 이전 취소는 100% 환불 가능합니다. 마이페이지에서 직접 취소하실 수 있습니다.",
        isAdmin: true,
        date: "2025-08-21"
      }
    ]
  },
  {
    id: "Q002",
    title: "인터넷 연결 문제",
    content: "오늘 A5 좌석을 이용했는데 와이파이 연결이 자꾸 끊깁니다.",
    category: "시설",
    status: "completed",
    date: "2025-08-20",
    answers: [
      {
        content: "불편을 드려 죄송합니다. 해당 구역 와이파이 라우터를 점검하도록 하겠습니다.",
        isAdmin: true,
        date: "2025-08-20"
      },
      {
        content: "네, 지금은 잘 되는 것 같습니다. 감사합니다!",
        isAdmin: false,
        date: "2025-08-20"
      }
    ]
  },
  {
    id: "Q003",
    title: "월정액 요금제 문의",
    content: "월정액으로 변경하고 싶은데 중간에 변경도 가능한가요?",
    category: "요금제",
    status: "waiting",
    date: "2025-08-22"
  }
];

const categories = [
  "전체",
  "예약",
  "시설",
  "요금제",
  "결제",
  "기타"
];

export default function InquiriesPage() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [category, setCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewInquiry, setShowNewInquiry] = useState(false);
  const [newReply, setNewReply] = useState("");

  const filteredInquiries = sampleInquiries.filter(inquiry => 
    (category === "전체" || inquiry.category === category) &&
    (inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmitReply = () => {
    if (!selectedInquiry || !newReply.trim()) return;
    
    // 실제로는 API 호출이 필요합니다
    alert("답변이 등록되었습니다.");
    setNewReply("");
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">문의 내역</h1>
        <p className="text-blue-100 text-lg">
          문의하신 내용과 답변을 확인하실 수 있습니다
        </p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="문의 내용 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => setShowNewInquiry(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            새 문의하기
          </button>
        </div>
        
        {/* 카테고리 필터 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 문의 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 문의 목록 패널 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredInquiries.map((inquiry) => (
              <button
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  selectedInquiry?.id === inquiry.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{inquiry.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      inquiry.status === "waiting"
                        ? "bg-yellow-100 text-yellow-800"
                        : inquiry.status === "answered"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {inquiry.status === "waiting"
                      ? "답변대기"
                      : inquiry.status === "answered"
                      ? "답변완료"
                      : "해결됨"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {inquiry.content}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">{inquiry.category}</span>
                  <span>{new Date(inquiry.date).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 상세 내용 패널 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {selectedInquiry ? (
            <div className="h-full flex flex-col">
              {/* 문의 상세 헤더 */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedInquiry.title}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedInquiry.status === "waiting"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedInquiry.status === "answered"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedInquiry.status === "waiting"
                      ? "답변대기"
                      : selectedInquiry.status === "answered"
                      ? "답변완료"
                      : "해결됨"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-3">{selectedInquiry.category}</span>
                  <span>
                    {new Date(selectedInquiry.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{selectedInquiry.content}</p>
              </div>

              {/* 답변 목록 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedInquiry.answers?.map((answer, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      answer.isAdmin ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-xl ${
                        answer.isAdmin
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p className="text-sm mb-2">{answer.content}</p>
                      <p className="text-xs opacity-75">
                        {new Date(answer.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 답변 입력 */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <FaPaperclip />
                  </button>
                  <input
                    type="text"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="답변 입력..."
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSubmitReply}
                    className="p-2 text-blue-600 hover:text-blue-700"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FaComments className="text-5xl mb-4 mx-auto" />
                <p>문의 내용을 선택해주세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
