package com.wb.between.reservation.service;

import com.wb.between.reservation.domain.Reservation;
import com.wb.between.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 예약 검증 서비스
 * 예약 생성/수정 시 비즈니스 규칙 검증을 담당
 */
@Service
@RequiredArgsConstructor
public class ReservationValidationService {

    private final ReservationRepository reservationRepository;

    /**
     * 새 예약 시간 검증
     * @param seatId 좌석 ID
     * @param startTime 예약 시작 시간
     * @param duration 예약 시간 (분)
     * @throws IllegalStateException 시간 중복인 경우
     * @throws IllegalArgumentException 영업시간 외 또는 잘못된 예약 시간인 경우
     */
    public void validateReservationTime(Long seatId, LocalDateTime startTime, Integer duration) {
        LocalDateTime endTime = startTime.plusMinutes(duration);
        
        List<Reservation> conflictingReservations = reservationRepository
                .findConflictingReservations(seatId, startTime, endTime);

        if (!conflictingReservations.isEmpty()) {
            throw new IllegalStateException("해당 시간에 이미 예약이 존재합니다.");
        }

        validateBusinessHours(startTime, endTime);
        validateReservationDuration(duration);
    }

    /**
     * 예약 수정 시 시간 검증
     * @param reservationId 수정할 예약 ID (자기 자신 제외용)
     * @param seatId 좌석 ID
     * @param startTime 예약 시작 시간
     * @param duration 예약 시간 (분)
     * @throws IllegalStateException 시간 중복인 경우
     * @throws IllegalArgumentException 영업시간 외 또는 잘못된 예약 시간인 경우
     */
    public void validateReservationTimeForUpdate(Long reservationId, Long seatId, 
                                                LocalDateTime startTime, Integer duration) {
        LocalDateTime endTime = startTime.plusMinutes(duration);
        
        List<Reservation> conflictingReservations = reservationRepository
                .findConflictingReservations(seatId, startTime, endTime);

        // 자기 자신 제외
        conflictingReservations.removeIf(reservation -> reservation.getId().equals(reservationId));

        if (!conflictingReservations.isEmpty()) {
            throw new IllegalStateException("해당 시간에 이미 예약이 존재합니다.");
        }

        validateBusinessHours(startTime, endTime);
        validateReservationDuration(duration);
    }

    /**
     * 영업시간 검증
     * @param startTime 예약 시작 시간
     * @param endTime 예약 종료 시간
     * @throws IllegalArgumentException 영업시간 외인 경우
     */
    private void validateBusinessHours(LocalDateTime startTime, LocalDateTime endTime) {
        int startHour = startTime.getHour();
        int endHour = endTime.getHour();

        // 영업시간: 09:00 ~ 22:00
        if (startHour < 9 || endHour > 22 || (endHour == 22 && endTime.getMinute() > 0)) {
            throw new IllegalArgumentException("영업시간(09:00~22:00) 내에서만 예약 가능합니다.");
        }
    }

    /**
     * 예약 시간 유효성 검증
     * @param duration 예약 시간 (분)
     * @throws IllegalArgumentException 잘못된 예약 시간인 경우
     */
    private void validateReservationDuration(Integer duration) {
        if (duration < 30) {
            throw new IllegalArgumentException("최소 예약 시간은 30분입니다.");
        }
        if (duration > 480) { // 8시간
            throw new IllegalArgumentException("최대 예약 시간은 8시간입니다.");
        }
        if (duration % 30 != 0) {
            throw new IllegalArgumentException("예약 시간은 30분 단위로만 가능합니다.");
        }
    }
}