package com.wb.between.reservation.domain;

public enum ReservationStatus {
    CONFIRMED("확정"),
    CANCELLED("취소"),
    COMPLETED("완료"),
    NO_SHOW("노쇼");

    private final String description;

    ReservationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}