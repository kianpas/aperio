package com.portfolio.aperio.faq.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Table(name = "Faq")
@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 요구사항 + 무분별한 생성 방지
@AllArgsConstructor(access = AccessLevel.PRIVATE) // 빌더 전용
@EntityListeners(AuditingEntityListener.class)
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키를 자동으로 1씩 증가
    private Long id; // 식별 번호

    @Column(name = "category", nullable = false, length = 50)
    private String category; // 카테고리 (서비스 이용, 예약 및 결제, 계정 관리, 시설 및 편의사항)
    
    @Column(name = "category_order")
    private Integer categoryOrder; // 카테고리 표시 순서

    @Column(name = "question", nullable = false, length = 500)
    private String question; // 질문

    @Column(name = "answer", nullable = false)
    private String answer; // 답변

    @Column(name = "display_order")
    private Integer displayOrder; // 질문 표시 순서

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true; // 활성화 여부

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성 시간

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 수정 시간


     // 비즈니스 메서드들
     public void updateContent(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }

    public void updateCategory(String category, String categoryIcon, Integer categoryOrder) {
        this.category = category;
        this.categoryOrder = categoryOrder;
    }

    public void updateDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }

    public void toggleStatus() {
        this.active = !this.active;
    }

    // 카테고리별 정렬을 위한 메서드
    public static int compareByCategoryAndOrder(Faq f1, Faq f2) {
        int categoryCompare = Integer.compare(
            f1.getCategoryOrder() != null ? f1.getCategoryOrder() : 999,
            f2.getCategoryOrder() != null ? f2.getCategoryOrder() : 999
        );
        
        if (categoryCompare != 0) {
            return categoryCompare;
        }
        
        return Integer.compare(
            f1.getDisplayOrder() != null ? f1.getDisplayOrder() : 999,
            f2.getDisplayOrder() != null ? f2.getDisplayOrder() : 999
        );
    }
}
