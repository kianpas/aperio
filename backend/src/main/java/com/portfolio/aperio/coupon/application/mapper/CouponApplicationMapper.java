package com.portfolio.aperio.coupon.application.mapper;

import com.portfolio.aperio.coupon.application.dto.command.CreateCouponCommand;
import com.portfolio.aperio.coupon.application.dto.result.CouponResult;
import com.portfolio.aperio.coupon.presentation.admin.dto.request.CreateCouponRequest;
import com.portfolio.aperio.coupon.presentation.admin.dto.response.CouponResponse;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class CouponApplicationMapper {

    public static CreateCouponCommand toCommand(CreateCouponRequest req) {
        return new CreateCouponCommand(
                req.name(),
                req.startAt(),
                req.endAt(),
                req.active()
        );
    }

    public static CouponResponse toResponse(CouponResult result) {
        return new CouponResponse(
                result.id(),
                result.name(),
                result.startAt(),
                result.endAt(),
                result.active()
        );
    }
}
