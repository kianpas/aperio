package com.portfolio.aperio.main.controller;

import com.portfolio.aperio.banner.dto.response.user.BannerListResponseDto;
import com.portfolio.aperio.banner.service.BannerService;
import com.portfolio.aperio.main.dto.response.user.MainDataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/main")  // 리소스 기반 + 버전 관리
@RequiredArgsConstructor
public class MainController {

    private final BannerService bannerService;

    /**
     * 프론트엔드 메인 화면용 API
     * GET /api/v1/main
     * 
     * @return 배너 목록과 메인 화면에 필요한 데이터
     */
    @GetMapping
    public ResponseEntity<?> getMainData() {

        List<BannerListResponseDto> bannerList = bannerService.findBannerList();

        // 메인 화면 데이터를 담는 응답 객체
        MainDataResponse response = MainDataResponse.builder()
                .bannerList(bannerList)
                .message("메인 화면 데이터 조회 성공")
                .build();

        return ResponseEntity.ok(response);

    }


}