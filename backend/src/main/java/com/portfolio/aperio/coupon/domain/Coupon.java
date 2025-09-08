package com.portfolio.aperio.coupon.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "userCoupons")
@EqualsAndHashCode(of = "id")
@Table(name = "coupons")
@EntityListeners(AuditingEntityListener.class)
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String name;

    @Column(length = 100)
    private String description;

    // "PERCENTAGE" or "FIXED"
    @Column(name = "discount_type", length = 20)
    private String discountType;

    // 할인 값 (퍼센트 또는 고정 금액)
    @Column(name = "discount_value", precision = 10, scale = 2)
    private BigDecimal discountValue;

    // 쿠폰 적용 최소 결제 금액
    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount;

    // 할인 상한선
    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    // 총 발급 한도
    @Column(name = "issue_limit")
    private Long issueLimit;

    @Column(name = "per_user_limit")
    private Long perUserLimit;

    @Column(name = "start_at")
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<UserCoupon> userCoupons = new HashSet<>();
}
