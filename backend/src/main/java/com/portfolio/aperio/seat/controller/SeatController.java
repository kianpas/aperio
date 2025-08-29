package com.portfolio.aperio.seat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.aperio.seat.dto.response.user.SeatResponse;
import com.portfolio.aperio.seat.service.SeatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    /**
     * 특정 날짜의 좌석 목록 조회 API (예약 상태 미반영)
     * 
     * @param date 조회 날짜 (YYYY-MM-DD)
     * @return 좌석 DTO 목록
     */
    @GetMapping
    public ResponseEntity<?> getSeats() {

        try {
            // 서비스 호출 시 branchId 제거됨
            List<SeatResponse> seatResponse = seatService.getAllSeats();
            return ResponseEntity.ok(seatResponse);
        } catch (Exception e) {
            e.printStackTrace(); // 개발 중 에러 확인을 위해 추가
            return ResponseEntity.internalServerError().body("좌석 정보 조회 중 오류가 발생했습니다.");
        }
    }
}