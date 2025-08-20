package com.portfolio.aperio.oauth.provider;

import java.util.Map;

// 전략 인터페이스
public interface OAuth2UserInfo {
    Map<String, Object> getAttributes();
    String getProviderId();
    String getProvider();
    String getEmail();
    String getName();

    // 선택적 정보는 default 메소드로 제공
    default String getPhoneNumber() {
        return null;
    }
}
