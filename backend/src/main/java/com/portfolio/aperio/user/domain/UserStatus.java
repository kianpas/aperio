package com.portfolio.aperio.user.domain;

public enum UserStatus {
    ACTIVE("활성", "정상적으로 사용 가능한 계정"),
    INACTIVE("비활성", "일시적으로 비활성화된 계정"),
    LOCKED("잠금", "보안상 잠긴 계정"),
    EXPIRED("만료", "사용 기간이 만료된 계정"),
    WITHDRAWN("탈퇴", "탈퇴한 계정");

    private final String displayName;
    private final String description;

    UserStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}