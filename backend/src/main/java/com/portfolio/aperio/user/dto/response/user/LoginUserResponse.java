package com.portfolio.aperio.user.dto.response.user;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;

import com.portfolio.aperio.user.domain.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginUserResponse {
    
    private String email;

    private String name;

    private List<String> authorities;

    // 정적 팩토리 메소드 - User 엔티티로부터 생성
    public static LoginUserResponse from(User user) {
        return LoginUserResponse.builder()
                .email(user.getEmail())
                .name(user.getName())
                .authorities(user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .build();
    }
    

}