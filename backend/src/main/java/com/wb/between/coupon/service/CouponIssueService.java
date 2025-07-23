package com.wb.between.coupon.service;

import com.wb.between.common.exception.CustomException;
import com.wb.between.common.exception.ErrorCode;
import com.wb.between.coupon.domain.Coupon;
import com.wb.between.user.domain.User;
import com.wb.between.usercoupon.service.UserCouponService;
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
