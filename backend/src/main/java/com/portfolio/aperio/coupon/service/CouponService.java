package com.portfolio.aperio.coupon.service;

import com.portfolio.aperio.common.exception.CustomException;
import com.portfolio.aperio.common.exception.ErrorCode;
import com.portfolio.aperio.coupon.domain.Coupon;
import com.portfolio.aperio.coupon.domain.UserCoupon;
import com.portfolio.aperio.coupon.dto.request.admin.AdminCouponEditReqDto;
import com.portfolio.aperio.coupon.dto.request.admin.AdminCouponRegistReqDto;
import com.portfolio.aperio.coupon.dto.response.admin.AdminCouponResDto;
import com.portfolio.aperio.coupon.repository.CouponRepository;
import com.portfolio.aperio.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Service
public class CouponService {

    private final CouponRepository couponRepository;

    /**
     * 쿠폰 조회
     */
    @Transactional(readOnly = true)
    public Coupon findById(Long couponId) {
       return couponRepository.findById(couponId).orElseThrow(()-> new CustomException(ErrorCode.INVALID_INPUT));
    }

    /**
     * 발급 가능 여부 조회 임시
     */
    @Transactional(readOnly = true)
    public boolean isValidForIssue(Coupon coupon) {
        return true;
    }

    /**
     * 쿠폰 생성
     */
    @Transactional
    public Coupon createCoupon(AdminCouponRegistReqDto adminCouponRegistReqDto) {
        log.debug("registAdminCoupon|adminCoupon = {}", adminCouponRegistReqDto);

        // 쿠폰 객체 생성
        Coupon coupon = Coupon.builder()
                .cpnNm(adminCouponRegistReqDto.getCpnNm())
                .discount(adminCouponRegistReqDto.getDiscount()) // DTO와 Entity의 타입이 맞아야 함
                .discountAt(adminCouponRegistReqDto.getDiscountAt())
                .cpnStartDt(adminCouponRegistReqDto.getCpnStartDt())
                .cpnEndDt(adminCouponRegistReqDto.getCpnEndDt())
                .cpnDsc(adminCouponRegistReqDto.getCpnDsc())
                // activeYn은 DTO에서 받거나, 서비스에서 기본값 설정 가능
                .activeYn(adminCouponRegistReqDto.getActiveYn() != null ? adminCouponRegistReqDto.getActiveYn() : "Y") // 예:
                // 기본값
                // 'Y'
                .createDate(LocalDateTime.now())
                .build();

        // === 데이터 영속화 ===
        // 리포지토리를 통해 Coupon 엔티티를 DB에 저장
        return couponRepository.save(coupon);
    }

    /**
     * 쿠폰 수정
     */
    @Transactional
    public AdminCouponResDto updateCoupon(Long cpNo, AdminCouponEditReqDto adminCouponEditReqDto) {

        // 1. 쿠폰정보 조회
        Coupon coupon = couponRepository.findById(cpNo).orElseThrow(() -> new CustomException(ErrorCode.INVALID_INPUT));
        log.debug("findAdminCoupon|coupon => {}", coupon);

        coupon.setCpnNm(adminCouponEditReqDto.getCpnNm());
        // 사용여부 수정
        coupon.setActiveYn(adminCouponEditReqDto.getActiveYn());
        coupon.setDiscount(adminCouponEditReqDto.getDiscount());
        coupon.setCpnDsc(adminCouponEditReqDto.getCpnDsc());
        coupon.setCpnStartDt(adminCouponEditReqDto.getCpnStartDt());
        coupon.setCpnEndDt(adminCouponEditReqDto.getCpnEndDt());

        return AdminCouponResDto.from(coupon);
    }

}
