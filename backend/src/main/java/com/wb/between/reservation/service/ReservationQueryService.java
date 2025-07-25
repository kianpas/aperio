package com.wb.between.reservation.service;

import com.wb.between.reservation.domain.Reservation;
import com.wb.between.reservation.dto.response.ReservationListResponse;
import com.wb.between.reservation.dto.response.ReservationResponse;
import com.wb.between.reservation.repository.ReservationQueryRepository;
import com.wb.between.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 예약 Query 서비스
 * CQRS 패턴에서 Query(조회) 작업을 담당
 * 읽기 전용 트랜잭션으로 성능 최적화
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationQueryService {

    private final ReservationRepository reservationRepository;
    private final ReservationQueryRepository reservationQueryRepository;

    /**
     * 예약 상세 정보 조회
     * @param reservationId 예약 ID
     * @return 예약 상세 정보
     * @throws IllegalArgumentException 존재하지 않는 예약인 경우
     */
    public ReservationResponse getReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        return ReservationResponse.from(reservation);
    }

    /**
     * 조건에 따른 예약 목록 조회
     * @param date 조회할 날짜 (선택사항)
     * @param userId 사용자 ID (선택사항)
     * @return 예약 목록
     */
    public List<ReservationListResponse> getReservations(LocalDate date, Long userId) {
        return reservationQueryRepository.findReservationsWithConditions(date, userId);
    }

    /**
     * 캘린더용 예약 목록 조회
     * @param startDate 시작 날짜
     * @param endDate 종료 날짜
     * @return 기간 내 예약 목록
     */
    public List<ReservationListResponse> getCalendarReservations(LocalDate startDate, LocalDate endDate) {
        return reservationQueryRepository.findCalendarReservations(startDate, endDate);
    }

    /**
     * 특정 사용자의 모든 예약 조회
     * @param userId 사용자 ID
     * @return 사용자의 예약 목록
     */
    public List<ReservationListResponse> getUserReservations(Long userId) {
        return reservationQueryRepository.findReservationsWithConditions(null, userId);
    }

    /**
     * 오늘의 모든 예약 조회
     * @return 오늘의 예약 목록
     */
    public List<ReservationListResponse> getTodayReservations() {
        return reservationQueryRepository.findReservationsWithConditions(LocalDate.now(), null);
    }
}