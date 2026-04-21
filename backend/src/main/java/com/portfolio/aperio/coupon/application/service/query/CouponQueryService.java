package com.portfolio.aperio.coupon.application.service.query;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.common.exception.ErrorCode;
import com.portfolio.aperio.coupon.domain.repository.CouponQueryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.portfolio.aperio.coupon.domain.entity.Coupon;
import com.portfolio.aperio.coupon.presentation.admin.dto.response.AdminCouponResDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponQueryService {

    private final CouponQueryRepository couponQueryRepository;

    /**
     * 쿠폰 조회
     */
    @Transactional(readOnly = true)
    public Coupon findById(Long couponId) {
        return couponQueryRepository.findById(couponId).orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT));
    }

    /**
     * 발급 가능 여부 조회 임시
     */
    @Transactional(readOnly = true)
    public boolean isValidForIssue(Coupon coupon) {
        return true;
    }

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
