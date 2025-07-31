package com.portfolio.aperio.usercoupon.service;

import com.portfolio.aperio.coupon.domain.Coupon;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.usercoupon.domain.UserCoupon;
import com.portfolio.aperio.usercoupon.repository.UserCouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserCouponService {

    private final UserCouponRepository userCouponRepository;

    public UserCoupon issueCoupon(User user, Coupon coupon) {
        UserCoupon userCoupon = UserCoupon.builder()
                .user(user)
                .coupon(coupon)
                .useAt("N")
                .build();

        return userCouponRepository.save(userCoupon);
    }

}
