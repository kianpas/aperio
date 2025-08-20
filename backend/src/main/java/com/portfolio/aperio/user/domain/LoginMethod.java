package com.portfolio.aperio.user.domain;

import java.lang.reflect.Array;
import java.util.Arrays;

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

    public static LoginMethod fromProivderId(String providerId) {
        return Arrays.stream(LoginMethod.values())
                .filter(method -> method.provider.equalsIgnoreCase(providerId))
                .findFirst()
                .orElse(EMAIL);
    }

}