package com.portfolio.aperio.reservation.dto.request.user;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReservationRequest {

    @NotNull(message = "seatId는 필수입니다.")
    private Long seatId;

    // 서버가 Enum을 사용 중이면 PlanType, 아니면 @Pattern으로 제약
    // @NotNull
    // private PlanType planType;
    @NotBlank(message = "planType은 필수입니다.")
    @Pattern(regexp = "HOURLY|DAILY|MONTHLY", message = "planType은 HOURLY|DAILY|MONTHLY 중 하나여야 합니다.")
    private String planType;

    // ISO-8601 (e.g. 2025-03-20T09:00:00), 서버에서 LocalDateTime으로 파싱
    @NotBlank(message = "startAt은 필수입니다.")
    private String startAt;

    @NotBlank(message = "endAt은 필수입니다.")
    private String endAt;

    // HOURLY 전용(선택): 클라이언트가 시간 슬롯 리스트를 보내고 서버가 start/end 계산하고 싶은 경우
    // "09:00", "10:00" 같은 HH:mm 문자열
    private List<@Pattern(regexp = "^\\d{2}:\\d{2}$", message = "HH:mm 형식이어야 합니다.") String> timeSlots;

    // 쿠폰(선택): 사용자 쿠폰 ID 또는 쿠폰 코드 중 사용 정책에 따라 하나만 사용
    private Long userCouponId;
    private String couponCode;


    private String reservationDate;

    private List<String> selectedTimes;
    private String couponId;

}
