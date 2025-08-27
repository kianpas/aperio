package com.portfolio.aperio.seat.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "seats")
@EntityListeners(AuditingEntityListener.class)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB에서 자동 증가 시 사용
    private Long id; // PK, Long 타입

    @Column(nullable = false, length = 100)
    private String name; // 좌석 이름

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatType seatType; // INDIVIDUAL, MEETING, PHONE

    @Column(nullable = false)
    private Integer hourlyPrice; // 시간당 가격

    @Column(nullable = false)
    private Integer dailyPrice; // 일일 가격

    @Column
    private Integer monthlyPrice; // 월정액 가격 (null이면 월정액 불가)

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 1; // 수용 인원

    @Column(length = 10)
    private String floor; // 층수 (2F, 3F)

    @Column(length = 100)
    private String location; // 위치 설명

    @CreationTimestamp // 엔티티 생성 시 자동으로 현재 시간 입력
    @Column(nullable = false, updatable = false) // 수정 불가
    private LocalDateTime createdAt;

    @LastModifiedDate // 엔티티 수정 시 자동으로 현재 시간 입력
    private LocalDateTime updatedAt;

    @Column(nullable = false, length = 100)
    private String register; // 등록자 정보

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

}