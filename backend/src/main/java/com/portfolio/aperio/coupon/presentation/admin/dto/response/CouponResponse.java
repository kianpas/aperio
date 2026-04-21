package com.portfolio.aperio.coupon.presentation.admin.dto.response;

import java.time.LocalDateTime;

public record CouponResponse(Long id,
                             String name,
                             LocalDateTime startAt,
                             LocalDateTime endAt,
                             boolean active) {
}
