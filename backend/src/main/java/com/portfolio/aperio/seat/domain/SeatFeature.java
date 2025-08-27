package com.portfolio.aperio.seat.domain;

import lombok.Getter;

@Getter
public enum SeatFeature {
    WIFI("Wi-Fi", "무선 인터넷"),
    MONITOR("모니터", "외부 모니터 제공"),
    COFFEE("커피", "무료 커피 제공"),
    WHITEBOARD("화이트보드", "화이트보드 사용 가능"),
    PROJECTOR("프로젝터", "프로젝터 사용 가능"),
    PHONE_BOOTH("방음", "방음 부스"),
    POWER_OUTLET("전원", "개인 전원 콘센트");

    private final String displayName;
    private final String description;

    SeatFeature(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}