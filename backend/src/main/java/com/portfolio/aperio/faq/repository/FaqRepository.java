package com.portfolio.aperio.faq.repository;

import com.portfolio.aperio.faq.domain.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Integer> {
    
    // 활성화된 FAQ만 조회 (카테고리 순서 → 질문 순서)
    List<Faq> findByActiveTrueOrderByCategoryOrderAscDisplayOrderAsc();
    
    // 특정 카테고리의 활성화된 FAQ 조회
    List<Faq> findByCategoryAndActiveTrueOrderByDisplayOrderAsc(String category);
    
    // 카테고리 목록 조회
    @Query("SELECT DISTINCT f.category FROM Faq f WHERE f.active = true ORDER BY MIN(f.categoryOrder)")
    List<String> findDistinctCategoriesByActiveTrue();
    
    // 관리자용: 모든 FAQ 조회
    List<Faq> findAllByOrderByCategoryOrderAscDisplayOrderAsc();
}
