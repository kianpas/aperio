package com.portfolio.aperio.reservation.domain;

import com.portfolio.aperio.seat.domain.Seat;
import com.portfolio.aperio.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@Table(name = "reservations")
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 요구사항 + 무분별한 생성 방지
@AllArgsConstructor(access = AccessLevel.PRIVATE) // 빌더 전용
@ToString(exclude = {"user", "seat"})
@EqualsAndHashCode(of = "id")
@EntityListeners(AuditingEntityListener.class)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 예약 번호 (PK)

    // 이 관계를 통해 JPA가 외래 키를 관리 (insert/update)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 이 관계를 통해 JPA가 외래 키를 관리 (insert/update)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt; // 예약 시작 시각 (날짜 + 시간)

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt; // 예약 종료 시각 (날짜 + 시간)

    @Column(nullable = false)
    private String planType; // 요금제

    // 금액(정확성 위해 BigDecimal)
    @Column(name = "base_price", precision = 15, scale = 2, nullable = false)
    private BigDecimal basePrice;

    // 할인 금액
    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount;

    // 최종 결제 금액
    @Column(name = "total_price", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "user_coupon_id")
    private Long userCouponId;

    // 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private ReservationStatus status;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 팩토리: 기본 검증 + 초기 상태 설정
    public static Reservation create(
            User user,
            Seat seat,
            LocalDateTime startAt,
            LocalDateTime endAt,
            String planType,
            BigDecimal basePrice,
            BigDecimal discountAmount,
            Long userCouponId) {
        if (user == null)
            throw new IllegalArgumentException("user는 필수입니다.");
        if (seat == null)
            throw new IllegalArgumentException("seat는 필수입니다.");
        if (startAt == null || endAt == null || !endAt.isAfter(startAt))
            throw new IllegalArgumentException("유효한 예약 기간이 필요합니다.");
        if (basePrice == null || basePrice.signum() < 0)
            throw new IllegalArgumentException("basePrice는 0 이상이어야 합니다.");

        BigDecimal discount = (discountAmount == null) ? BigDecimal.ZERO : discountAmount.max(BigDecimal.ZERO);
        BigDecimal total = basePrice.subtract(discount).max(BigDecimal.ZERO);

        return Reservation.builder()
                .user(user)
                .seat(seat)
                .startAt(startAt)
                .endAt(endAt)
                .planType(planType)
                .basePrice(basePrice)
                .discountAmount(discount)
                .totalPrice(total)
                .userCouponId(userCouponId)
                .status(ReservationStatus.PENDING) // 초기: 보류/대기
                .build();
    }

    // 비즈니스 로직
    public void confirm() {
        ensureStatus(ReservationStatus.PENDING);
        this.status = ReservationStatus.CONFIRMED;
    }

    public void cancel() {
        if (this.status == ReservationStatus.CANCELLED)
            return;
        if (this.status == ReservationStatus.COMPLETED)
            throw new IllegalStateException("완료된 예약은 취소할 수 없습니다.");
        this.status = ReservationStatus.CANCELLED;
    }

    public void complete() {
        if (this.status != ReservationStatus.CONFIRMED)
            throw new IllegalStateException("확정된 예약만 완료할 수 있습니다.");
        this.status = ReservationStatus.COMPLETED;
    }

    public void applyDiscount(BigDecimal discount) {
        if (discount == null || discount.signum() < 0)
            throw new IllegalArgumentException("discount는 0 이상이어야 합니다.");
        this.discountAmount = discount;
        this.totalPrice = this.basePrice.subtract(discount).max(BigDecimal.ZERO);
    }

    private void ensureStatus(ReservationStatus expected) {
        if (this.status != expected) {
            throw new IllegalStateException("상태가 올바르지 않습니다. 현재=" + this.status + ", 기대=" + expected);
        }
    }
}