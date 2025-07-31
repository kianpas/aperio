package com.portfolio.aperio.faq.repository;

import com.portfolio.aperio.faq.domain.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqRepository extends JpaRepository<Faq, Integer> {
}
