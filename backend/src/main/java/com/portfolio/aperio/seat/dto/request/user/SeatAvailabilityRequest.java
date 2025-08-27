package com.portfolio.aperio.seat.dto.request.user;


import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SeatAvailabilityRequest {
    @NotNull(message = "날짜는 필수입니다.")
    private LocalDate date;
    
    @NotNull(message = "요금제는 필수입니다.")
    private String planType; // "HOURLY", "DAILY", "MONTHLY"
}