package com.portfolio.aperio.main.controller;

import com.portfolio.aperio.banner.dto.response.user.BannerListResponseDto;
import com.portfolio.aperio.banner.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MainApiController {

    private final BannerService bannerService;

    /**
     * 프론트엔드 메인 화면용 API
     * 기존 MainController의 "/" 경로와 동일한 데이터를 JSON으로 반환
     * 
     * @return 배너 목록과 메인 화면에 필요한 데이터
     */
    @GetMapping("/main")
    public ResponseEntity<?> getMainData() {
        try {
            List<BannerListResponseDto> bannerList = bannerService.findBannerList();

            // 메인 화면 데이터를 담는 응답 객체
            MainDataResponse response = MainDataResponse.builder()
                    .bannerList(bannerList)
                    .message("메인 화면 데이터 조회 성공")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("메인 화면 데이터 조회 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("메인 화면 데이터 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 메인 화면 응답 DTO
     */
    @lombok.Builder
    @lombok.Getter
    public static class MainDataResponse {
        private List<BannerListResponseDto> bannerList;
        private String message;
    }
}