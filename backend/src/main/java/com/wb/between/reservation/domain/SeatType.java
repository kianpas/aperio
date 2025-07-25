package com.wb.between.reservation.domain;

public enum SeatType {
    SINGLE("1인석"),
    DOUBLE("2인석"),
    GROUP("그룹석"),
    MEETING("회의실");

    private final String description;

    SeatType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}