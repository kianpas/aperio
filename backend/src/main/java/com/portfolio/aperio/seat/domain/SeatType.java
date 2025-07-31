package com.portfolio.aperio.seat.domain;

/**
 * 좌석 타입 열거형
 * 다양한 좌석 유형을 정의
 */
public enum SeatType {
    SINGLE("1인석"),
    DOUBLE("2인석"),
    GROUP("그룹석"),
    MEETING("회의실"),
    STUDY("스터디룸");

    private final String description;

    SeatType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}