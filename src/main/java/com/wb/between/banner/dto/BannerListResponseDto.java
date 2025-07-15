package com.wb.between.banner.dto;

import com.wb.between.common.entity.Banner;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class BannerListResponseDto {

    private Long bNo;

    private String bTitle;

    private String bImageUrl;

    private Date startDt;

    private Date endDt;

    private String register;

    private Date createDt;

    private String useAt;

    public static BannerListResponseDto from(Banner banner) {
        return BannerListResponseDto.builder()
                .bNo(banner.getBannerNo())
                .bTitle(banner.getBannerTitle())
                .bImageUrl(banner.getBannerImageUrl())
                .startDt(banner.getStartDt())
                .endDt(banner.getEndDt())
                .register(banner.getRegister())
                .createDt(banner.getCreateDt())
                .useAt(banner.getUseAt())
                .build();

    }
}
