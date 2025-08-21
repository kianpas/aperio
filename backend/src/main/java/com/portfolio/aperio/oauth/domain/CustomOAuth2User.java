package com.portfolio.aperio.oauth.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@RequiredArgsConstructor
@Getter
public class CustomOAuth2User implements OAuth2User {


    private final Long userId;

    private final Collection<? extends GrantedAuthority> authorities;

    private final Map<String, Object> attributes;

    private final String nameAttributeKey; // 동적으로 받은 Key


    @Override
    public String getName() {
        return (String) attributes.get(nameAttributeKey);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

}
