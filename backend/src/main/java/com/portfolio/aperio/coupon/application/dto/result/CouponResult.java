package com.portfolio.aperio.coupon.application.dto.result;

import java.time.LocalDateTime;

public record CouponResult(    Long id,
                               String name,
                               LocalDateTime startAt,
                               LocalDateTime endAt,
                               boolean active) {
}
