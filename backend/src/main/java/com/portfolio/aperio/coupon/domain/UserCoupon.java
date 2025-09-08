package com.portfolio.aperio.coupon.domain;

import com.portfolio.aperio.user.domain.User;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "user", "coupon" })
@Table(name = "user_coupons")
@EqualsAndHashCode(of = "id")
@EntityListeners(AuditingEntityListener.class)
public class UserCoupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // DB: created_at

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // DB: updated_at

    @Column(name = "used_at", nullable = true)
    private LocalDateTime usedAt;
}
