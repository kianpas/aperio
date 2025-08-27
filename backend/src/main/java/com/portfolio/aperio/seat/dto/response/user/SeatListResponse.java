package com.portfolio.aperio.seat.dto.response.user;

import com.portfolio.aperio.seat.domain.Seat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SeatListResponse {

    private Long id;

    public static SeatListResponse from(Seat seat) {
        return SeatListResponse.builder()
            .id(seat.getSeatNo())
            .build();
    }
    
}
