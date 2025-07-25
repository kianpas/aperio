package com.wb.between.reservation.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ReservationUpdateRequest {

    private LocalDateTime reservationDateTime;
    private Integer duration; // 분 단위
    private String memo;

    public ReservationUpdateRequest(LocalDateTime reservationDateTime, Integer duration, String memo) {
        this.reservationDateTime = reservationDateTime;
        this.duration = duration;
        this.memo = memo;
    }
}