package com.portfolio.aperio.faq.dto.response.user;

import java.time.LocalDateTime;
import java.util.List;

import com.portfolio.aperio.faq.domain.Faq;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FaqResponse {
    private Long id;
    private String category;
    private Integer categoryOrder;
    private String question;
    private String answer;
    private Integer displayOrder;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FaqResponse from(Faq faq) {
        return FaqResponse.builder()
                .id(faq.getId())
                .category(faq.getCategory())
                .categoryOrder(faq.getCategoryOrder())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .displayOrder(faq.getDisplayOrder())
                .active(faq.getActive())
                .createdAt(faq.getCreatedAt())
                .updatedAt(faq.getUpdatedAt())
                .build();
    }
}