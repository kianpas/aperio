// 백엔드 응답과 1:1 매칭
export interface FaqResponse {
    id: number;
    category: string;
    categoryOrder: number;
    question: string;
    answer: string;
    displayOrder: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  // 프론트엔드에서 그룹화할 때 사용할 타입
  export interface FaqCategory {
    category: string;
    categoryOrder: number;
    questions: FaqItem[];
  }
  
  export interface FaqItem {
    id: number;
    question: string;
    answer: string;
    displayOrder: number;
  }
  
  // 컴포넌트 Props 타입
  export interface FAQSectionProps {
    category: FaqCategory;
  }
  
  // 아이콘 매핑 타입
  export type CategoryIconMap = Record<string, React.ComponentType<{ className?: string }>>;