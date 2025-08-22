"use client";

import { useState } from "react";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface FAQ {
  category: string;
  icon: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const faqData: FAQ[] = [
  {
    category: "서비스 이용",
    icon: "🏢",
    questions: [
      {
        question: "서비스 이용 방법은 어떻게 되나요?",
        answer:
          "회원가입 후 로그인하시면 원하시는 서비스를 예약하고 이용하실 수 있습니다. 예약 페이지에서 원하는 좌석이나 회의실을 선택하고 결제를 진행하시면 됩니다.",
      },
      {
        question: "운영 시간은 어떻게 되나요?",
        answer:
          "저희 Aperio 공유 오피스는 연중무휴 24시간 운영됩니다. 언제든지 편하신 시간에 방문하여 이용하실 수 있습니다.",
      },
      {
        question: "주차는 가능한가요?",
        answer:
          "건물 내 지하주차장을 이용하실 수 있습니다. 시간당 요금이 부과되며, 월 정기권 회원은 무료 주차 혜택을 제공해 드립니다.",
      },
    ],
  },
  {
    category: "예약 및 결제",
    icon: "💳",
    questions: [
      {
        question: "예약 취소는 어떻게 하나요?",
        answer:
          "마이페이지의 '예약 내역'에서 취소하고 싶은 예약을 찾아 '예약 취소' 버튼을 클릭하시면 됩니다. 취소 수수료는 이용 규정에 따라 달라질 수 있습니다.",
      },
      {
        question: "결제 수단에는 어떤 것들이 있나요?",
        answer:
          "신용카드, 체크카드, 그리고 간편 결제(카카오페이, 네이버페이)를 지원하고 있습니다. 월 정기권의 경우 자동 결제도 가능합니다.",
      },
      {
        question: "환불 규정은 어떻게 되나요?",
        answer:
          "이용 24시간 전 취소 시 100% 환불, 12시간 전 취소 시 50% 환불이 가능합니다. 그 이후 취소 시에는 환불이 불가능합니다.",
      },
    ],
  },
  {
    category: "계정 관리",
    icon: "👤",
    questions: [
      {
        question: "비밀번호를 잊어버렸어요.",
        answer:
          "로그인 페이지의 '비밀번호 찾기' 링크를 통해 가입하신 이메일로 비밀번호 재설정 링크를 받으실 수 있습니다.",
      },
      {
        question: "회원 탈퇴는 어떻게 하나요?",
        answer:
          "마이페이지 > 설정 > 회원 탈퇴에서 진행하실 수 있습니다. 탈퇴 시 모든 데이터는 삭제되며 복구가 불가능합니다.",
      },
    ],
  },
  {
    category: "시설 및 편의사항",
    icon: "🏢",
    questions: [
      {
        question: "인터넷은 어떻게 사용하나요?",
        answer:
          "모든 공간에서 초고속 Wi-Fi를 무료로 이용하실 수 있습니다. 접속 정보는 현장에서 확인하실 수 있습니다.",
      },
      {
        question: "프린터 사용이 가능한가요?",
        answer:
          "공용 프린터를 이용하실 수 있습니다. 흑백 출력은 페이지당 100원, 컬러 출력은 페이지당 500원입니다.",
      },
      {
        question: "회의실 예약 시 준비된 시설은 무엇인가요?",
        answer:
          "모든 회의실에는 프로젝터/TV, 화이트보드, 화상회의 장비가 구비되어 있습니다. 추가로 필요한 장비는 프론트에 문의해 주세요.",
      },
    ],
  },
];

const FAQSection = ({ faq }: { faq: FAQ }) => {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    if (openQuestions.includes(index)) {
      setOpenQuestions(openQuestions.filter((i) => i !== index));
    } else {
      setOpenQuestions([...openQuestions, index]);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <span className="text-2xl">{faq.icon}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{faq.category}</h2>
      </div>
      <div className="space-y-4">
        {faq.questions.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-6 py-4 flex justify-between items-center text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.question}
              </h3>
              {openQuestions.includes(index) ? (
                <FaChevronUp className="text-blue-500" />
              ) : (
                <FaChevronDown className="text-gray-400" />
              )}
            </button>
            {openQuestions.includes(index) && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <FaQuestionCircle className="text-5xl mx-auto mb-4 text-blue-100" />
          <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
          <p className="text-lg text-blue-100">
            Aperio 서비스 이용에 대해 궁금하신 점을 확인하세요
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqData.map((faq, index) => (
          <FAQSection key={index} faq={faq} />
        ))}

        <div className="mt-12 text-center bg-blue-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            더 궁금하신 점이 있으신가요?
          </h3>
          <p className="text-gray-600 mb-6">
            문의하기를 통해 답변을 받아보실 수 있습니다
          </p>
          <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            문의하기
          </button>
        </div>
      </div>
    </div>
  );
}
