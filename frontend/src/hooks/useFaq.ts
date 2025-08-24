import { useState, useEffect } from "react";
import { faqAPI } from "@/lib/api/faq";
import { FaqResponse } from "@/types/faq";

interface UseFaqReturn {
  faqs: FaqResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFaq = (): UseFaqReturn => {
  const [faqs, setFaqs] = useState<FaqResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await faqAPI.getFaqs();
      setFaqs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "FAQ 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return {
    faqs,
    loading,
    error,
    refetch: fetchFaqs,
  };
};
