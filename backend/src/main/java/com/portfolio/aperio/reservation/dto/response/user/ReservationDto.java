package com.portfolio.aperio.reservation.dto.response.user;

import com.portfolio.aperio.reservation.domain.Reservation;
import com.portfolio.aperio.reservation.domain.ReservationStatus;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Value
@Builder
public class ReservationDto {
    Long id;
    String seatName;
    String date;       // yyyy-MM-dd (startAt 기준)
    String startTime;  // HH:mm
    String endTime;    // HH:mm
    String status;     // upcoming | in-progress | completed | cancelled
    BigDecimal price;  // totalPrice
    String reservationDate; // yyyy-MM-dd (createdAt)

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    public static ReservationDto from(Reservation r) {
        String seatName = (r.getSeat() != null && r.getSeat().getName() != null) ? r.getSeat().getName() : "-";

        String date = r.getStartAt() != null ? r.getStartAt().toLocalDate().format(DATE) : "";
        String start = r.getStartAt() != null ? r.getStartAt().toLocalTime().format(TIME) : "";
        String end = r.getEndAt() != null ? r.getEndAt().toLocalTime().format(TIME) : "";

        String uiStatus = toUiStatus(r.getStatus(), r.getStartAt(), r.getEndAt());

        String createdDate = r.getCreatedAt() != null ? r.getCreatedAt().toLocalDate().format(DATE) : "";

        return ReservationDto.builder()
                .id(r.getId())
                .seatName(seatName)
                .date(date)
                .startTime(start)
                .endTime(end)
                .status(uiStatus)
                .price(r.getTotalPrice())
                .reservationDate(createdDate)
                .build();
    }

    private static String toUiStatus(ReservationStatus status, LocalDateTime startAt, LocalDateTime endAt) {
        if (status == ReservationStatus.CANCELLED) return "cancelled";
        LocalDateTime now = LocalDateTime.now();
        if (startAt != null && endAt != null && (now.isEqual(startAt) || (now.isAfter(startAt) && now.isBefore(endAt)))) {
            return "in-progress";
        }
        if (endAt != null && endAt.isAfter(now)) return "upcoming";
        return "completed";
    }
}

