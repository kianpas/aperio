package com.wb.between.coupon.service;

import com.wb.between.common.exception.CustomException;
import com.wb.between.common.exception.ErrorCode;
import com.wb.between.coupon.repository.CouponQueryRepository;
import com.wb.between.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.wb.between.coupon.domain.Coupon;
import com.wb.between.coupon.dto.request.admin.AdminCouponRegistReqDto;
import com.wb.between.coupon.dto.request.admin.AdminCouponEditReqDto;
import com.wb.between.coupon.dto.response.admin.AdminCouponResDto;


import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponQueryService {

    private final CouponQueryRepository couponQueryRepository;

    /**
     * 관리자 > 쿠폰 목록
     */
    public Page<AdminCouponResDto> findAdminCouponList(Pageable pageable, String searchCouponName) {
        Page<Coupon> couponPageList = couponQueryRepository.findCouponsWithFilter(pageable, searchCouponName);
        return couponPageList.map(AdminCouponResDto::from);
    }


    /**
     * 쿠폰 상세 조회
     */
    @Transactional(readOnly = true)
    public AdminCouponResDto findAdminCoupon(Long cpNo) {
        Coupon coupon = couponQueryRepository.findById(cpNo).orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT));
        log.debug("findAdminCoupon|coupon => {}", coupon);
        return AdminCouponResDto.from(coupon);
    }



}
