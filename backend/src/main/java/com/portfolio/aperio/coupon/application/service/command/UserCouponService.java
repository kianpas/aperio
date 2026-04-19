package com.portfolio.aperio.coupon.application.service.command;

import com.portfolio.aperio.coupon.domain.entity.Coupon;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.coupon.domain.entity.UserCoupon;
import com.portfolio.aperio.coupon.domain.repository.UserCouponRepository;
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
