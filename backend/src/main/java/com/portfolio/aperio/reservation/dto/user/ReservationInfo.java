package com.portfolio.aperio.reservation.dto.user;

import java.time.LocalDateTime;

import com.portfolio.aperio.reservation.domain.Reservation;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationInfo {

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    public static ReservationInfo from(Reservation reservation) {
        return ReservationInfo.builder()
                .startTime(reservation.getStartAt())
                .endTime(reservation.getEndAt())
                .status(reservation.getStatus().toString())
                .build();
    }

}
