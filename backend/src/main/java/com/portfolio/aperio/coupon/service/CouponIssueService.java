package com.portfolio.aperio.coupon.service;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.common.exception.ErrorCode;
import com.portfolio.aperio.coupon.domain.Coupon;
import com.portfolio.aperio.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class CouponIssueService {

    private final CouponService couponService;
    private final UserCouponService userCouponService;

    @Transactional
    public void issueSignUpCoupon(User user) {
        // 1. 쿠폰 결정 로직
        Long couponId = determineCouponByUser(user);

        // 2. 쿠폰 조회 및 검증
        Coupon coupon = couponService.findById(couponId);
        if (!couponService.isValidForIssue(coupon)) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        // 3. 쿠폰 발급
        userCouponService.issueCoupon(user, coupon);
    }

    private Long determineCouponByUser(User user) {
        return user.getEmail().endsWith("@winbit.kr") ? 2L : 1L;
    }

}
