package com.portfolio.aperio.reservation.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReservationRequestDto {
    private Long itemId;
    private String reservationDate;
    private String planType;
    private List<String> selectedTimes;
    private String couponId;
}