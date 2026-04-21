package com.portfolio.aperio.coupon.application.dto.command;

import java.time.LocalDateTime;

public record CreateCouponCommand(String name,
                                  LocalDateTime startAt,
                                  LocalDateTime endAt,
                                  boolean active) {
}
