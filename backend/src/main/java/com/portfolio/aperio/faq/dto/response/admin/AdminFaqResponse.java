package com.portfolio.aperio.faq.dto.response.admin;

import java.time.LocalDateTime;

import com.portfolio.aperio.faq.domain.Faq;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminFaqResponse {

    private Long id;
    private String category;
    private Integer categoryOrder;
    private String question;
    private String answer;
    private Integer displayOrder;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminFaqResponse from(Faq faq) {
        return AdminFaqResponse.builder()
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
