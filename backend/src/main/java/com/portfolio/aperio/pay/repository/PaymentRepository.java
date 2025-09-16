package com.portfolio.aperio.pay.repository;

import com.portfolio.aperio.pay.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByResNo(Long resNo); // 예약 번호로 결제 정보 찾기
}
