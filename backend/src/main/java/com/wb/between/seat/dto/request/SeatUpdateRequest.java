package com.wb.between.seat.dto.request;

import com.wb.between.seat.domain.SeatType;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 좌석 수정 요청 DTO
 */
@Getter
@NoArgsConstructor
public class SeatUpdateRequest {

    private SeatType seatType;
    private String description;

    public SeatUpdateRequest(SeatType seatType, String description) {
        this.seatType = seatType;
        this.description = description;
    }
}