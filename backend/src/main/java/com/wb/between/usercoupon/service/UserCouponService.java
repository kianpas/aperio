package com.wb.between.usercoupon.service;

import com.wb.between.coupon.domain.Coupon;
import com.wb.between.user.domain.User;
import com.wb.between.usercoupon.domain.UserCoupon;
import com.wb.between.usercoupon.repository.UserCouponRepository;
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
