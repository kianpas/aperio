package com.portfolio.aperio.coupon.application.service.command;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.common.exception.ErrorCode;
import com.portfolio.aperio.coupon.application.dto.command.CreateCouponCommand;
import com.portfolio.aperio.coupon.application.dto.result.CouponResult;
import com.portfolio.aperio.coupon.domain.entity.Coupon;
import com.portfolio.aperio.coupon.presentation.admin.dto.request.AdminCouponEditReqDto;
import com.portfolio.aperio.coupon.presentation.admin.dto.request.AdminCouponRegistReqDto;
import com.portfolio.aperio.coupon.presentation.admin.dto.response.AdminCouponResDto;
import com.portfolio.aperio.coupon.domain.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Service
public class CouponCommandService {

    private final CouponRepository couponRepository;

    /**
     * 쿠폰 생성
     */
    @Transactional
    public CouponResult createCoupon(CreateCouponCommand cmd) {
        log.debug("registAdminCoupon|adminCoupon = {}", cmd);

        // 쿠폰 객체 생성
        Coupon coupon = Coupon.builder()
                .name(cmd.name())
                // .discount(adminCouponRegistReqDto.getDiscount()) // DTO와 Entity의 타입이 맞아야 함
                // .discountAt(adminCouponRegistReqDto.getDiscountAt())
                .startAt(cmd.startAt())
                .endAt(cmd.endAt())
//                .description(adminCouponRegistReqDto.getCpnDsc())
                // activeYn은 DTO에서 받거나, 서비스에서 기본값 설정 가능
                .active(cmd.active())
                // 기본값
                // 'Y'
                .createdAt(LocalDateTime.now())
                .build();

        // === 데이터 영속화 ===
        // 리포지토리를 통해 Coupon 엔티티를 DB에 저장
        Coupon saved = couponRepository.save(coupon);

        return new CouponResult(
                saved.getId(),
                saved.getName(),
                saved.getStartAt(),
                saved.getEndAt(),
                saved.getActive()
        );
    }

    /**
     * 쿠폰 수정
     */
    @Transactional
    public AdminCouponResDto updateCoupon(Long cpNo, AdminCouponEditReqDto adminCouponEditReqDto) {

        // 1. 쿠폰정보 조회
        Coupon coupon = couponRepository.findById(cpNo).orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT));
        log.debug("findAdminCoupon|coupon => {}", coupon);

        coupon.setName(adminCouponEditReqDto.getCpnNm());
        // 사용여부 수정
        // coupon.setActiveYn(adminCouponEditReqDto.getActiveYn());
        // coupon.setDiscount(adminCouponEditReqDto.getDiscount());
        coupon.setDescription(adminCouponEditReqDto.getCpnDsc());
        coupon.setStartAt(adminCouponEditReqDto.getCpnStartDt());
        coupon.setEndAt(adminCouponEditReqDto.getCpnEndDt());

        return AdminCouponResDto.from(coupon);
    }

}
