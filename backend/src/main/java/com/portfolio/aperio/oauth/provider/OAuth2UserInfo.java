package com.portfolio.aperio.oauth.provider;

import com.portfolio.aperio.user.domain.LoginMethod;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.domain.UserStatus;

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

    default User toEntity() {
        return User.builder()
                .name(getName())
                .email(getEmail())
                .userStatus(UserStatus.ACTIVE)
                .loginMethod(LoginMethod.valueOf(getProvider().toUpperCase()))
                .build();
    }
}
