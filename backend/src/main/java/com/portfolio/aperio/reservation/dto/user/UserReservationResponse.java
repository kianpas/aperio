package com.portfolio.aperio.reservation.dto.user;

import com.portfolio.aperio.reservation.domain.Reservation;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// 마이페이지 > 예약 내역 조회 DTO
@Getter
@Setter
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 받는 생성자
@Builder
public class UserReservationResponse {

    private Long resNo;                 // 예약 번호
    private BigDecimal totalPrice;          // 총 결제 금액
    private BigDecimal basePrice;            // 좌석 예약 비용
    private BigDecimal discountAmount;             // 할인 비용

    private String userCpNo;            // 쿠폰 식별 번호

    private LocalDateTime resDt;        // 예약일자
    private String resStatus;            // 예약상태 (예: "예약완료", "이용완료", "취소됨")
    private LocalDateTime resStart;     // 예약 시작일자
    private LocalDateTime resEnd;       // 예약 종료일자

    private String seat;                // 좌석 번호
    private String seatNm;              // Seat 엔티티와 조인해서 가져와야 함 (실제 구현 시)

    public static UserReservationResponse from(Reservation reservation) {
        return UserReservationResponse.builder()
                .resNo(reservation.getId())
                .totalPrice(reservation.getTotalPrice())
                .basePrice(reservation.getBasePrice())
                .discountAmount(reservation.getDiscountAmount())
                .build();
    }


}
