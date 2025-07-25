package com.wb.between.reservation.controller;

import com.wb.between.reservation.dto.request.ReservationCreateRequest;
import com.wb.between.reservation.dto.request.ReservationUpdateRequest;
import com.wb.between.reservation.dto.response.ReservationResponse;
import com.wb.between.reservation.dto.response.ReservationListResponse;
import com.wb.between.reservation.service.ReservationService;
import com.wb.between.reservation.service.ReservationQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 예약 관리 REST API 컨트롤러
 * CQRS 패턴을 적용하여 Command와 Query 서비스를 분리하여 사용
 */
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationQueryService reservationQueryService;

    // ========== Command Operations (CUD) ==========
    
    /**
     * 새로운 예약 생성
     * @param request 예약 생성 요청 정보
     * @return 생성된 예약 정보
     */
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @RequestBody ReservationCreateRequest request) {
        ReservationResponse response = reservationService.createReservation(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 기존 예약 정보 수정
     * @param reservationId 수정할 예약 ID
     * @param request 수정할 예약 정보
     * @return 수정된 예약 정보
     */
    @PutMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> updateReservation(
            @PathVariable Long reservationId,
            @RequestBody ReservationUpdateRequest request) {
        ReservationResponse response = reservationService.updateReservation(reservationId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 예약 취소
     * @param reservationId 취소할 예약 ID
     * @return 204 No Content
     */
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long reservationId) {
        reservationService.cancelReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    // ========== Query Operations (Read) ==========
    
    /**
     * 예약 상세 정보 조회
     * @param reservationId 조회할 예약 ID
     * @return 예약 상세 정보
     */
    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable Long reservationId) {
        ReservationResponse response = reservationQueryService.getReservation(reservationId);
        return ResponseEntity.ok(response);
    }

    /**
     * 조건에 따른 예약 목록 조회
     * @param date 조회할 날짜 (선택사항)
     * @param userId 사용자 ID (선택사항)
     * @return 예약 목록
     */
    @GetMapping
    public ResponseEntity<List<ReservationListResponse>> getReservations(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) Long userId) {
        List<ReservationListResponse> responses = reservationQueryService.getReservations(date, userId);
        return ResponseEntity.ok(responses);
    }

    /**
     * 캘린더용 예약 목록 조회
     * @param startDate 시작 날짜
     * @param endDate 종료 날짜
     * @return 기간 내 예약 목록
     */
    @GetMapping("/calendar")
    public ResponseEntity<List<ReservationListResponse>> getCalendarReservations(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<ReservationListResponse> responses = reservationQueryService.getCalendarReservations(startDate, endDate);
        return ResponseEntity.ok(responses);
    }
}