package com.portfolio.aperio.seat.dto.response.user;

import com.portfolio.aperio.seat.domain.Seat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Builder;

@Getter
@Builder
@AllArgsConstructor
public class SeatResponse {

    private Long id;

    private String name;
    
    private String seatType;
    
    private String description;
    
    private Integer hourlyPrice;
    
    private Integer dailyPrice;
    
    private Integer monthlyPrice;
    
    private Integer capacity;
    
    private String floor;
    
    private String location;

    public static SeatResponse from(Seat seat) {
        return SeatResponse.builder()
            .id(seat.getId())
            .name(seat.getName())
            .seatType(seat.getSeatType().name())
            .description(seat.getSeatType().getDescription())
            .hourlyPrice(seat.getHourlyPrice())
            .dailyPrice(seat.getDailyPrice())
            .monthlyPrice(seat.getMonthlyPrice())
            .capacity(seat.getCapacity())
            .floor(seat.getFloor())
            .location(seat.getLocation())
            .build();
    }
    
}
