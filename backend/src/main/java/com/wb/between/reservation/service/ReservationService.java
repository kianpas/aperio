package com.wb.between.reservation.service;

import com.wb.between.reservation.domain.Reservation;
import com.wb.between.reservation.dto.request.ReservationCreateRequest;
import com.wb.between.reservation.dto.request.ReservationUpdateRequest;
import com.wb.between.reservation.dto.response.ReservationResponse;
import com.wb.between.reservation.repository.ReservationRepository;

import com.wb.between.seat.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 예약 서비스
 * CQRS 패턴에서 Command(생성, 수정, 삭제) 작업을 담당
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final SeatService seatService; // 도메인 서비스 사용
    private final ReservationValidationService validationService;

    /**
     * 새로운 예약 생성
     * @param request 예약 생성 요청 정보
     * @return 생성된 예약 정보
     * @throws IllegalArgumentException 존재하지 않는 좌석인 경우
     * @throws IllegalStateException 예약 시간이 중복되거나 예약 불가능한 좌석인 경우
     */
    public ReservationResponse createReservation(ReservationCreateRequest request) {
        // 좌석 존재 및 예약 가능 여부 확인 (도메인 서비스 사용)
        if (!seatService.isAvailableForReservation(request.getSeatId())) {
            throw new IllegalStateException("예약할 수 없는 좌석입니다.");
        }

        // 예약 시간 중복 확인
        validationService.validateReservationTime(
                request.getSeatId(),
                request.getReservationDateTime(),
                request.getDuration()
        );

        Reservation reservation = Reservation.builder()
                .userId(request.getUserId())
                .seatId(request.getSeatId())
                .reservationDateTime(request.getReservationDateTime())
                .duration(request.getDuration())
                .memo(request.getMemo())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        return ReservationResponse.from(savedReservation);
    }

    /**
     * 기존 예약 정보 수정
     * @param reservationId 예약 ID
     * @param request 수정할 예약 정보
     * @return 수정된 예약 정보
     * @throws IllegalArgumentException 존재하지 않는 예약인 경우
     * @throws IllegalStateException 활성 상태가 아닌 예약이거나 시간 중복인 경우
     */
    public ReservationResponse updateReservation(Long reservationId, ReservationUpdateRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        if (!reservation.isActive()) {
            throw new IllegalStateException("활성 상태가 아닌 예약은 수정할 수 없습니다.");
        }

        // 시간 변경이 있는 경우 중복 확인
        if (!reservation.getReservationDateTime().equals(request.getReservationDateTime()) ||
            !reservation.getDuration().equals(request.getDuration())) {
            
            validationService.validateReservationTimeForUpdate(
                    reservationId,
                    reservation.getSeatId(),
                    request.getReservationDateTime(),
                    request.getDuration()
            );
        }

        reservation.updateReservation(
                request.getReservationDateTime(),
                request.getDuration(),
                request.getMemo()
        );

        return ReservationResponse.from(reservation);
    }

    /**
     * 예약 취소
     * @param reservationId 취소할 예약 ID
     * @throws IllegalArgumentException 존재하지 않는 예약인 경우
     * @throws IllegalStateException 이미 취소되었거나 완료된 예약인 경우
     */
    public void cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        if (!reservation.isActive()) {
            throw new IllegalStateException("이미 취소되었거나 완료된 예약입니다.");
        }

        reservation.cancel();
    }

    /**
     * 예약 완료 처리
     * @param reservationId 완료 처리할 예약 ID
     * @throws IllegalArgumentException 존재하지 않는 예약인 경우
     * @throws IllegalStateException 활성 상태가 아닌 예약인 경우
     */
    public void completeReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        if (!reservation.isActive()) {
            throw new IllegalStateException("활성 상태가 아닌 예약은 완료 처리할 수 없습니다.");
        }

        reservation.complete();
    }
}