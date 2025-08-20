package com.portfolio.aperio.oauth.provider;

import java.util.Map;

public class OAuth2UserInfoProvider {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase("google")) {
            return new GoogleUserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase("naver")) {
            return new NaverUserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase("kakao")) {
            return new KakaoUserInfo(attributes);
        }
        // 다른 프로바이더 추가 시 여기에 else if 추가
        
        throw new IllegalArgumentException("Unsupported provider: " + registrationId);
    }
}
