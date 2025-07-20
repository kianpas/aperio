package com.wb.between.coupon.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wb.between.coupon.domain.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("SELECT c FROM Coupon c WHERE c.cpnNm LIKE CONCAT('%', :searchCpnNm, '%')")
    Page<Coupon> findCouponsWithFilter(Pageable pageable,
            @Param("searchCpnNm") String searchCouponName);
}
