package com.wb.between.admin.main.dto;

import com.wb.between.banner.domain.Banner;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Builder
public class AdminBannerResDto {

    private Long bNo;

    private String bTitle;

    private String bImageUrl;

    private Date startDt;

    private Date endDt;

    private String register;

    private Date createDt;

    private String useAt;

    public static AdminBannerResDto from(Banner banner) {
            return AdminBannerResDto.builder()
                .bNo(banner.getBNo())
                .bTitle(banner.getBTitle())
                .bImageUrl(banner.getBImageUrl())
                .startDt(banner.getStartDt())
                .endDt(banner.getEndDt())
                .register(banner.getRegister())
                .createDt(banner.getCreateDt())
                .useAt(banner.getUseAt())
                .build();

    }

}
