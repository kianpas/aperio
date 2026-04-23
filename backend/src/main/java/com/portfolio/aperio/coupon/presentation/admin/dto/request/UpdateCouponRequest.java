package com.portfolio.aperio.coupon.presentation.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record UpdateCouponRequest(@NotBlank String name,
                                  @NotNull LocalDateTime startAt,
                                  @NotNull LocalDateTime endAt,
                                  boolean active) {
}
