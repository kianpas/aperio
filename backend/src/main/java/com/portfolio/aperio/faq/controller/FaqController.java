package com.portfolio.aperio.faq.controller;

import com.portfolio.aperio.faq.domain.Faq;
import com.portfolio.aperio.faq.service.FaqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
     * FAQ 목록 조회 API
     * GET /api/v1/faqs
     * 
     * @return FAQ 목록 JSON 응답
     */
    @GetMapping
    public ResponseEntity<List<Faq>> getFaqs() {
        try {
            List<Faq> faqs = faqService.findAll();
            return ResponseEntity.ok(faqs);
        } catch (Exception e) {
            log.error("FAQ 목록 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * FAQ 목록 조회 API (응답 DTO 포함)
     * GET /api/v1/faqs/list
     * 
     * @return FAQ 목록과 메타데이터를 포함한 JSON 응답
     */
    @GetMapping("/list")
    public ResponseEntity<?> getFaqList() {
        try {
            List<Faq> faqs = faqService.findAll();
            
            FaqListResponse response = FaqListResponse.builder()
                    .faqs(faqs)
                    .count(faqs.size())
                    .message("FAQ 목록 조회 성공")
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("FAQ 목록 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("FAQ 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * FAQ 목록 응답 DTO
     */
    @lombok.Builder
    @lombok.Getter
    public static class FaqListResponse {
        private List<Faq> faqs;
        private int count;
        private String message;
    }
}