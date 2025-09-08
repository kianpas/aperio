package com.portfolio.aperio.coupon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.aperio.coupon.domain.Coupon;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    // 기본 CRUD는 JpaRepository에서 제공
    // save, findById, delete, findAll 등
    
    // 간단한 조건 조회만 포함
    List<Coupon> findByActiveTrue();
    
    Optional<Coupon> findByName(String couponName);
    
    // 복잡한 조회는 CouponQueryRepository로 이동
}
