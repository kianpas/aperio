package com.wb.between.reservation.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ReservationCreateRequest {

    private Long userId;
    private Long seatId;
    private LocalDateTime reservationDateTime;
    private Integer duration; // 분 단위
    private String memo;

    public ReservationCreateRequest(Long userId, Long seatId, LocalDateTime reservationDateTime, 
                                   Integer duration, String memo) {
        this.userId = userId;
        this.seatId = seatId;
        this.reservationDateTime = reservationDateTime;
        this.duration = duration;
        this.memo = memo;
    }
}