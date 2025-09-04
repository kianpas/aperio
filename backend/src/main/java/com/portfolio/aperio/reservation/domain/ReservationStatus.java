package com.portfolio.aperio.reservation.domain;

public enum ReservationStatus {
    CONFIRMED("확정"),
    CANCELLED("취소"),
    COMPLETED("완료"),
    PENDING("보류");

    private final String description;

    ReservationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}