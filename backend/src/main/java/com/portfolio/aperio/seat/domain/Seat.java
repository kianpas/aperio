package com.portfolio.aperio.seat.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
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

    @Column(name = "hourly_price", precision = 15, scale = 2)
    private BigDecimal hourlyPrice; // 시간당 가격

    @Column(name = "daily_price", precision = 15, scale = 2)
    private BigDecimal dailyPrice; // 일일 가격

    @Column(name = "monthly_price", precision = 15, scale = 2)
    private BigDecimal monthlyPrice; // 월정액 가격 (null이면 월정액 불가)

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 1; // 수용 인원

    @Column(length = 10)
    private String floor; // 층수 (2F, 3F)

    @Column(length = 100)
    private String location; // 위치 설명

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false, length = 100)
    private String register; // 등록자 정보

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

}