package com.portfolio.aperio.main.dto.response.user;

import com.portfolio.aperio.banner.dto.response.user.BannerResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MainDataResponse {

        private List<BannerResponse> bannerList;
        private String message;

}
