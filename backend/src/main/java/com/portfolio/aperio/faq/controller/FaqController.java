package com.portfolio.aperio.faq.controller;

import com.portfolio.aperio.faq.dto.response.user.FaqResponse;
import com.portfolio.aperio.faq.service.FaqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/faqs")  // 리소스 기반 + 버전 관리
@RequiredArgsConstructor
public class FaqController {

    private final FaqService faqService;
    /**
     * 모든 활성화된 FAQ 목록 조회 (플랫 구조)
     * GET /api/v1/faqs
     */
    @GetMapping
    public ResponseEntity<List<FaqResponse>> getFaqs() {
        try {
            List<FaqResponse> faqs = faqService.getAllActiveFaqs();
            return ResponseEntity.ok(faqs);
        } catch (Exception e) {
            log.error("FAQ 목록 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

  /**
     * 특정 카테고리의 FAQ 목록 조회
     * GET /api/v1/faqs/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FaqResponse>> getFaqsByCategory(@PathVariable String category) {
        try {
            List<FaqResponse> faqs = faqService.getFaqsByCategory(category);
            return ResponseEntity.ok(faqs);
        } catch (Exception e) {
            log.error("카테고리별 FAQ 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * FAQ 카테고리 목록 조회
     * GET /api/v1/faqs/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        try {
            List<String> categories = faqService.getCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("FAQ 카테고리 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
   
}