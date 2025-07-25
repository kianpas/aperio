package com.wb.between.seat.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 좌석 엔티티
 * 카페나 스터디룸의 좌석 정보를 관리하는 도메인 객체
 */
@Entity
@Table(name = "seats")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 좌석 번호 (고유) */
    @Column(nullable = false, unique = true)
    private String seatNumber;

    /** 좌석 타입 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatType seatType;

    /** 좌석 활성화 여부 */
    @Column(nullable = false)
    private Boolean isActive;

    /** 좌석 설명 */
    @Column(length = 200)
    private String description;

    private LocalDateTime createdDt;

    private LocalDateTime updatedDt;

    /**
     * 좌석 생성자
     * @param seatNumber 좌석 번호
     * @param seatType 좌석 타입
     * @param description 좌석 설명
     */
    @Builder
    public Seat(String seatNumber, SeatType seatType, String description) {
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.isActive = true;
        this.description = description;
    }

    /**
     * 좌석 비활성화
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * 좌석 활성화
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * 좌석 정보 수정
     * @param seatType 새로운 좌석 타입
     * @param description 새로운 설명
     */
    public void updateSeat(SeatType seatType, String description) {
        this.seatType = seatType;
        this.description = description;
    }

    /**
     * 좌석이 사용 가능한지 확인
     * @return 활성화된 좌석인 경우 true
     */
    public boolean isAvailable() {
        return this.isActive;
    }
}