package com.portfolio.aperio.faq.service;

import com.portfolio.aperio.faq.domain.Faq;
import com.portfolio.aperio.faq.dto.request.admin.AddFaqRequest;
import com.portfolio.aperio.faq.dto.response.user.FaqResponse;
import com.portfolio.aperio.faq.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FaqService {

    private final FaqRepository faqRepository;

    // 모든 활성화된 FAQ 조회 (정렬된 상태)
    public List<FaqResponse> getAllActiveFaqs() {
        List<Faq> faqs = faqRepository.findByActiveTrueOrderByCategoryOrderAscDisplayOrderAsc();
        return faqs.stream()
                .map(FaqResponse::from)
                .collect(Collectors.toList());
    }

    // 특정 카테고리의 FAQ 조회
    public List<FaqResponse> getFaqsByCategory(String category) {
        List<Faq> faqs = faqRepository.findByCategoryAndActiveTrueOrderByDisplayOrderAsc(category);
        return faqs.stream()
                .map(FaqResponse::from)
                .collect(Collectors.toList());
    }

    // 카테고리 목록 조회
    public List<String> getCategories() {
        return faqRepository.findDistinctCategoriesByActiveTrue();
    }

}
