package com.portfolio.aperio.user.dto.response.user;

import com.portfolio.aperio.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserResponse {

    private Long userId;
    private String email;
    private String name;
    private String message;
    private LocalDateTime createdAt;

    public static RegisterUserResponse success(User user) {
        return RegisterUserResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .message("회원가입이 완료되었습니다")
                .createdAt(user.getCreatedAt())
                .build();
    }
}
