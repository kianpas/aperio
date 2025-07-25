package com.wb.between.reservation.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 예약 엔티티
 * 사용자의 좌석 예약 정보를 관리하는 도메인 객체
 */
@Entity
@Table(name = "reservations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 예약한 사용자 ID */
    @Column(nullable = false)
    private Long userId;

    /** 예약된 좌석 ID */
    @Column(nullable = false)
    private Long seatId;

    /** 예약 시작 시간 */
    @Column(nullable = false)
    private LocalDateTime reservationDateTime;

    /** 예약 시간 (분 단위) */
    @Column(nullable = false)
    private Integer duration;

    /** 예약 상태 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    private LocalDateTime createdDt;

    private LocalDateTime updatedDt;

    /** 예약 메모 */
    @Column(length = 500)
    private String memo;

    /**
     * 예약 생성자
     * @param userId 사용자 ID
     * @param seatId 좌석 ID
     * @param reservationDateTime 예약 시작 시간
     * @param duration 예약 시간 (분)
     * @param memo 예약 메모
     */
    @Builder
    public Reservation(Long userId, Long seatId, LocalDateTime reservationDateTime, 
                      Integer duration, String memo) {
        this.userId = userId;
        this.seatId = seatId;
        this.reservationDateTime = reservationDateTime;
        this.duration = duration;
        this.status = ReservationStatus.CONFIRMED;
        this.memo = memo;
    }

    /**
     * 예약 정보 수정
     * @param reservationDateTime 새로운 예약 시간
     * @param duration 새로운 예약 시간 (분)
     * @param memo 새로운 메모
     */
    public void updateReservation(LocalDateTime reservationDateTime, Integer duration, String memo) {
        this.reservationDateTime = reservationDateTime;
        this.duration = duration;
        this.memo = memo;
    }

    /**
     * 예약 취소
     */
    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
    }

    /**
     * 예약 완료 처리
     */
    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }

    /**
     * 예약이 활성 상태인지 확인
     * @return 확정 상태인 경우 true
     */
    public boolean isActive() {
        return status == ReservationStatus.CONFIRMED;
    }

    /**
     * 예약 종료 시간 계산
     * @return 예약 종료 시간
     */
    public LocalDateTime getEndDateTime() {
        return reservationDateTime.plusMinutes(duration);
    }

}