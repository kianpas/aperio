package com.portfolio.aperio.user.dto.response.user;

import com.portfolio.aperio.user.domain.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserProfileResponse {

    private Long userNo;

    private String email;

    private String name;

    private String phoneNo;

    private LocalDateTime createDt;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .userNo(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNo(user.getPhoneNumber())
                .createDt(user.getCreatedAt())
                .build();
    }

}
