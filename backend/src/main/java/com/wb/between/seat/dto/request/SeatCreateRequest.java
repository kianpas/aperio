package com.wb.between.seat.dto.request;

import com.wb.between.seat.domain.SeatType;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 좌석 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
public class SeatCreateRequest {

    private String seatNumber;
    private SeatType seatType;
    private String description;

    public SeatCreateRequest(String seatNumber, SeatType seatType, String description) {
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.description = description;
    }
}