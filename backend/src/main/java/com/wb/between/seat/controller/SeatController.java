package com.wb.between.seat.controller;

import com.wb.between.seat.domain.SeatType;
import com.wb.between.seat.dto.request.SeatCreateRequest;
import com.wb.between.seat.dto.request.SeatUpdateRequest;
import com.wb.between.seat.dto.response.SeatResponse;
import com.wb.between.seat.dto.response.SeatListResponse;
import com.wb.between.seat.service.SeatService;
import com.wb.between.seat.service.SeatQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 좌석 관리 REST API 컨트롤러
 * CQRS 패턴을 적용하여 Command와 Query 서비스를 분리하여 사용
 */
@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;
    private final SeatQueryService seatQueryService;

    // ========== Command Operations (CUD) ==========
    
    /**
     * 새로운 좌석 생성
     * @param request 좌석 생성 요청 정보
     * @return 생성된 좌석 정보
     */
    @PostMapping
    public ResponseEntity<SeatResponse> createSeat(@RequestBody SeatCreateRequest request) {
        SeatResponse response = seatService.createSeat(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 기존 좌석 정보 수정
     * @param seatId 수정할 좌석 ID
     * @param request 수정할 좌석 정보
     * @return 수정된 좌석 정보
     */
    @PutMapping("/{seatId}")
    public ResponseEntity<SeatResponse> updateSeat(
            @PathVariable Long seatId,
            @RequestBody SeatUpdateRequest request) {
        SeatResponse response = seatService.updateSeat(seatId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 좌석 비활성화
     * @param seatId 비활성화할 좌석 ID
     * @return 204 No Content
     */
    @PatchMapping("/{seatId}/deactivate")
    public ResponseEntity<Void> deactivateSeat(@PathVariable Long seatId) {
        seatService.deactivateSeat(seatId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 좌석 활성화
     * @param seatId 활성화할 좌석 ID
     * @return 204 No Content
     */
    @PatchMapping("/{seatId}/activate")
    public ResponseEntity<Void> activateSeat(@PathVariable Long seatId) {
        seatService.activateSeat(seatId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 좌석 완전 삭제 (관리자용)
     * @param seatId 삭제할 좌석 ID
     * @return 204 No Content
     */
    @DeleteMapping("/{seatId}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long seatId) {
        seatService.deleteSeat(seatId);
        return ResponseEntity.noContent().build();
    }

    // ========== Query Operations (Read) ==========
    
    /**
     * 좌석 상세 정보 조회
     * @param seatId 조회할 좌석 ID
     * @return 좌석 상세 정보
     */
    @GetMapping("/{seatId}")
    public ResponseEntity<SeatResponse> getSeat(@PathVariable Long seatId) {
        SeatResponse response = seatQueryService.getSeat(seatId);
        return ResponseEntity.ok(response);
    }

    /**
     * 활성화된 좌석 목록 조회
     * @return 활성화된 좌석 목록
     */
    @GetMapping
    public ResponseEntity<List<SeatListResponse>> getActiveSeats() {
        List<SeatListResponse> responses = seatQueryService.getActiveSeats();
        return ResponseEntity.ok(responses);
    }

    /**
     * 특정 타입의 활성화된 좌석 조회
     * @param seatType 좌석 타입
     * @return 해당 타입의 활성화된 좌석 목록
     */
    @GetMapping("/type/{seatType}")
    public ResponseEntity<List<SeatListResponse>> getSeatsByType(@PathVariable SeatType seatType) {
        List<SeatListResponse> responses = seatQueryService.getSeatsByType(seatType);
        return ResponseEntity.ok(responses);
    }

    /**
     * 좌석 번호로 좌석 조회
     * @param seatNumber 좌석 번호
     * @return 좌석 정보
     */
    @GetMapping("/number/{seatNumber}")
    public ResponseEntity<SeatResponse> getSeatByNumber(@PathVariable String seatNumber) {
        SeatResponse response = seatQueryService.getSeatByNumber(seatNumber);
        return ResponseEntity.ok(response);
    }

    /**
     * 모든 좌석 조회 (관리자용)
     * @return 모든 좌석 목록
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<SeatListResponse>> getAllSeats() {
        List<SeatListResponse> responses = seatQueryService.getAllSeats();
        return ResponseEntity.ok(responses);
    }
}