package com.portfolio.aperio.main.dto.response.user;

import com.portfolio.aperio.banner.dto.response.user.BannerListResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MainDataResponse {

        private List<BannerListResponseDto> bannerList;
        private String message;

}
