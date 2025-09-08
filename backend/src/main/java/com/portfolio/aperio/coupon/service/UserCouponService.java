package com.portfolio.aperio.coupon.service;

import com.portfolio.aperio.coupon.domain.Coupon;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.coupon.domain.UserCoupon;
import com.portfolio.aperio.coupon.repository.UserCouponRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserCouponService {

    private final UserCouponRepository userCouponRepository;

    public UserCoupon issueCoupon(User user, Coupon coupon) {
        UserCoupon userCoupon = UserCoupon.builder()
                .user(user)
                .coupon(coupon)
                .usedAt(LocalDateTime.now())
                .build();

        return userCouponRepository.save(userCoupon);
    }

}
