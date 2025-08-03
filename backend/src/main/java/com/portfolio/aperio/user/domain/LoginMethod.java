package com.portfolio.aperio.user.domain;

public enum LoginMethod {
    EMAIL("이메일", "email"),
    KAKAO("카카오", "kakao"),
    NAVER("네이버", "naver"),
    GOOGLE("구글", "google");

    private final String displayName;
    private final String provider;

    LoginMethod(String displayName, String provider) {
        this.displayName = displayName;
        this.provider = provider;
    }

}