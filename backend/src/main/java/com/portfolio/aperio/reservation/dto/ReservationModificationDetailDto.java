package com.portfolio.aperio.reservation.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReservationModificationDetailDto {
    private Long resNo;
    private String planType;
    private String reservationDate;
    private SeatInfo seatInfo;
    private List<String> selectedTimes;
    private String status;
    private String originalTotalPrice;

    @Getter
    @Builder
    public static class SeatInfo {
        private Long id;
        private String name;
        private String type;
    }
}