package com.wb.between.reservation.dto.response;

import com.wb.between.reservation.domain.ReservationStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReservationListResponse {

    private final Long id;
    private final Long userId;
    private final Long seatId;
    private final String seatNumber;
    private final LocalDateTime reservationDateTime;
    private final Integer duration;
    private final ReservationStatus status;
    private final String memo;

    public ReservationListResponse(Long id, Long userId, Long seatId, String seatNumber,
                                  LocalDateTime reservationDateTime, Integer duration,
                                  ReservationStatus status, String memo) {
        this.id = id;
        this.userId = userId;
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.reservationDateTime = reservationDateTime;
        this.duration = duration;
        this.status = status;
        this.memo = memo;
    }

    public LocalDateTime getEndDateTime() {
        return reservationDateTime.plusMinutes(duration);
    }
}