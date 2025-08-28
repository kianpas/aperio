import { useState } from 'react';
import { ContactForm, ContactFormErrors, ContactRequest } from '@/types/contact';
import { contactApi } from '@/lib/api/contact';

const initialFormData: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  category: 'general',
  message: '',
};

export const useContact = () => {
  const [formData, setFormData] = useState<ContactForm>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 폼 검증 함수
  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2글자 이상 입력해주세요.';
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 전화번호 검증 (선택사항이지만 입력시 형식 검증)
    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9-+\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = '올바른 전화번호 형식을 입력해주세요.';
      }
    }

    // 제목 검증
    if (!formData.subject.trim()) {
      newErrors.subject = '문의 제목을 입력해주세요.';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = '제목은 5글자 이상 입력해주세요.';
    }

    // 메시지 검증
    if (!formData.message.trim()) {
      newErrors.message = '문의 내용을 입력해주세요.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '문의 내용은 10글자 이상 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 입력 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 실시간 에러 제거
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const requestData: ContactRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        category: formData.category,
        message: formData.message.trim(),
      };

      await contactApi.submitContact(requestData);
      
      setIsSubmitted(true);
      setFormData(initialFormData);
      setErrors({});
      
      return true;
    } catch (error) {
      console.error('문의 전송 실패:', error);
      setErrors({ message: '문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 폼 리셋
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    handleInputChange,
    handleSubmit,
    resetForm,
    setIsSubmitted,
  };
};