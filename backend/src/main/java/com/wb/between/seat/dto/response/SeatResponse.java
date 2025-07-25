package com.wb.between.seat.dto.response;

import com.wb.between.seat.domain.Seat;
import com.wb.between.seat.domain.SeatType;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 좌석 상세 응답 DTO
 */
@Getter
public class SeatResponse {

    private final Long id;
    private final String seatNumber;
    private final SeatType seatType;
    private final Boolean isActive;
    private final String description;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public SeatResponse(Long id, String seatNumber, SeatType seatType, Boolean isActive,
                       String description, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.isActive = isActive;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static SeatResponse from(Seat seat) {
        return new SeatResponse(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getSeatType(),
                seat.getIsActive(),
                seat.getDescription(),
                seat.getCreatedDt(),
                seat.getUpdatedDt()
        );
    }

    public String getSeatTypeDescription() {
        return seatType.getDescription();
    }
}