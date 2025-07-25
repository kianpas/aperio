package com.wb.between.reservation.dto.response;

import com.wb.between.reservation.domain.Reservation;
import com.wb.between.reservation.domain.ReservationStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReservationResponse {

    private final Long id;
    private final Long userId;
    private final Long seatId;
    private final LocalDateTime reservationDateTime;
    private final Integer duration;
    private final ReservationStatus status;
    private final String memo;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public ReservationResponse(Long id, Long userId, Long seatId, LocalDateTime reservationDateTime,
                              Integer duration, ReservationStatus status, String memo,
                              LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.seatId = seatId;
        this.reservationDateTime = reservationDateTime;
        this.duration = duration;
        this.status = status;
        this.memo = memo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ReservationResponse from(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getUserId(),
                reservation.getSeatId(),
                reservation.getReservationDateTime(),
                reservation.getDuration(),
                reservation.getStatus(),
                reservation.getMemo(),
                reservation.getCreatedDt(),
                reservation.getUpdatedDt()
        );
    }

    public LocalDateTime getEndDateTime() {
        return reservationDateTime.plusMinutes(duration);
    }
}