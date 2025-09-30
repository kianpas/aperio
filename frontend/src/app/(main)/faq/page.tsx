"use client";

import { useState } from "react";
import { useFaq } from "@/hooks/useFaq";
import {
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaCreditCard,
  FaUser,
  FaWifi,
} from "react-icons/fa";
import { FaqResponse, CategoryIconMap } from "@/types/faq";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 카테고리별 아이콘 매핑
const CATEGORY_ICON_MAP: CategoryIconMap = {
  "서비스 이용": FaBuilding,
  "예약 및 결제": FaCreditCard,
  "계정 관리": FaUser,
  "시설 및 편의사항": FaWifi,
};

// 간단한 그룹화 함수
function groupFaqsByCategory(faqs: FaqResponse[]) {
  // faqs가 배열인지 확인
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return [];
  }
  const grouped: Record<string, FaqResponse[]> = {};

  faqs.forEach((faq) => {
    if (!grouped[faq.category]) {
      grouped[faq.category] = [];
    }
    grouped[faq.category].push(faq);
  });

  // 카테고리 순서대로 정렬
  return Object.entries(grouped)
    .sort(([, a], [, b]) => a[0].categoryOrder - b[0].categoryOrder)
    .map(([category, questions]) => ({
      category,
      categoryOrder: questions[0].categoryOrder,
      questions: questions.sort((a, b) => a.displayOrder - b.displayOrder),
    }));
}

interface FAQSectionProps {
  category: string;
  questions: FaqResponse[];
}

const FAQSection = ({ category, questions }: FAQSectionProps) => {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const IconComponent = CATEGORY_ICON_MAP[category] || FaBuilding;

  // questions 배열 안전성 검사
  if (!Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      {/* 카테고리 헤더 */}
      <div className="flex items-center mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mr-4">
          <IconComponent className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {questions.length}개의 질문
          </p>
        </div>
      </div>

      {/* FAQ 아이템들 */}
      <div className="space-y-3">
        {questions.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:scale-[1.01]"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 pr-4">
                {item.question}
              </h3>
              <div className="flex-shrink-0">
                {openQuestions.includes(index) ? (
                  <FaChevronUp className="text-blue-600 text-sm" />
                ) : (
                  <FaChevronDown className="text-gray-400 text-sm" />
                )}
              </div>
            </button>
            {openQuestions.includes(index) && (
              <div className="px-6 pb-5 border-t border-gray-50">
                <div className="pt-4">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FAQPage() {
  const { faqs, loading, error, refetch } = useFaq();

  // if (loading) {
  //   return (
  //     <LoadingSpinner
  //       size="lg"
  //       text="FAQ를 불러오는 중..."
  //       fullScreen
  //       gradient
  //       double
  //     />
  //   );
  // }
  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="text-red-600 mb-4">{error}</div>
  //         <button
  //           onClick={refetch}
  //           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  //         >
  //           다시 시도
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // 페이지에서 직접 그룹화 (React 19 컴파일러가 최적화)
  const groupedFaqs = groupFaqsByCategory(faqs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-6">
            <span className="text-4xl" role="img" aria-label="질문">
              ❓
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">자주 묻는 질문</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Aperio 서비스 이용에 대해 궁금하신 점을 확인하세요
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {groupedFaqs.map(({ category, questions }) => (
          <FAQSection
            key={category}
            category={category}
            questions={questions}
          />
        ))}

        {/* 문의하기 섹션 */}
        <div className="mt-16 text-center bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
            <span className="text-2xl" role="img" aria-label="대화">
              💬
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            더 궁금하신 점이 있으신가요?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            문의하기를 통해 빠른 답변을 받아보실 수 있습니다
          </p>
          <button
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            onClick={() => console.log("문의하기 클릭")}
          >
            문의하기
          </button>
        </div>
      </div>
    </div>
  );
}
