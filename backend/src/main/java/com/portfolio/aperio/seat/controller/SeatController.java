package com.portfolio.aperio.seat.controller;

import com.portfolio.aperio.seat.dto.SeatDto;
import com.portfolio.aperio.seat.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SeatController {

    @Autowired
    private SeatService seatService;

    /**
     * 특정 날짜의 좌석 목록 조회 API (예약 상태 미반영)
     * @param date 조회 날짜 (YYYY-MM-DD)
     * @return 좌석 DTO 목록
     */
    @GetMapping("/seats")
    public ResponseEntity<?> getSeats(
            // branchId 파라미터 제거됨
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            // 서비스 호출 시 branchId 제거됨
            List<SeatDto> seatStatus = seatService.getSeatStatus(date);
            return ResponseEntity.ok(seatStatus);
        } catch (Exception e) {
            System.err.println("Error fetching seat status: " + e.getMessage());
            e.printStackTrace(); // 개발 중 에러 확인을 위해 추가
            return ResponseEntity.internalServerError().body("좌석 정보 조회 중 오류가 발생했습니다.");
        }
    }
}