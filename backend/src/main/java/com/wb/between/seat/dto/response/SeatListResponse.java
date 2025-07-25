package com.wb.between.seat.dto.response;

import com.wb.between.seat.domain.Seat;
import com.wb.between.seat.domain.SeatType;
import lombok.Getter;

/**
 * 좌석 목록 응답 DTO
 */
@Getter
public class SeatListResponse {

    private final Long id;
    private final String seatNumber;
    private final SeatType seatType;
    private final Boolean isActive;
    private final String description;

    public SeatListResponse(Long id, String seatNumber, SeatType seatType, 
                           Boolean isActive, String description) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.isActive = isActive;
        this.description = description;
    }

    public static SeatListResponse from(Seat seat) {
        return new SeatListResponse(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getSeatType(),
                seat.getIsActive(),
                seat.getDescription()
        );
    }

    public String getSeatTypeDescription() {
        return seatType.getDescription();
    }
}