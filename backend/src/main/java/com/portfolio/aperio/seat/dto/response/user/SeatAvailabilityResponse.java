package com.portfolio.aperio.seat.dto.response.user;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SeatAvailabilityResponse {

    private Long id;
    private String name;
    private String date;
    private List<TimeSlot> timeSlots;
    private Boolean isDailyAvailable;
    private Boolean isMonthlyAvailable;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class TimeSlot {
        private String time; // "09:00"
        private Boolean isAvailable;
        private Integer price;
        private String reason; // "reserved", "maintenance"
    }

}
