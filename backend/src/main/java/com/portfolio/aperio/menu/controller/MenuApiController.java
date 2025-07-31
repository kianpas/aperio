package com.portfolio.aperio.menu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MenuApiController {

    /**
     * 프론트엔드용 메뉴 목록 API
     * @return 메뉴 목록 JSON 응답
     */
    @GetMapping("/menus")
    public ResponseEntity<List<Map<String, Object>>> getMenus() {
        try {
            // 임시 메뉴 데이터 (실제로는 DB에서 조회)
            List<Map<String, Object>> menus = Arrays.asList(
                Map.of(
                    "menuNo", 1,
                    "menuNm", "예약하기",
                    "menuUrl", "/reservation",
                    "menuSort", 1,
                    "useAt", "Y"
                ),
                Map.of(
                    "menuNo", 2,
                    "menuNm", "요금안내",
                    "menuUrl", "#pricing-section",
                    "menuSort", 2,
                    "useAt", "Y"
                ),
                Map.of(
                    "menuNo", 3,
                    "menuNm", "문의하기",
                    "menuUrl", "/contact",
                    "menuSort", 3,
                    "useAt", "Y"
                )
            );
            
            return ResponseEntity.ok(menus);
        } catch (Exception e) {
            System.err.println("메뉴 목록 조회 중 오류 발생: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}