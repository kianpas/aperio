package com.portfolio.aperio.banner.dto.response.admin;

import com.portfolio.aperio.banner.domain.Banner;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Builder
public class AdminBannerResponse {

    private Long id;

    private String title;

    private String imageUrl;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private String register;

    private LocalDateTime createdAt;

    private boolean active;

    public static AdminBannerResponse from(Banner banner) {
        return AdminBannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .imageUrl(banner.getImageUrl())
                .startAt(banner.getStartAt())
                .endAt(banner.getEndAt())
                .register(banner.getRegister())
                .createdAt(banner.getCreatedAt())
                .active(banner.getActive())
                .build();

    }

}
