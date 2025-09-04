package com.portfolio.aperio.user.dto.response.user;

import com.portfolio.aperio.user.domain.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserInfoResponse {

    private Long userId;

    private String email;

    private String name;

    private String phoneNumber;

    private LocalDateTime createdAt;

    public static UserInfoResponse from(User user) {
        return UserInfoResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
