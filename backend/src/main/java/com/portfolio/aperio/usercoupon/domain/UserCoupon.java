package com.portfolio.aperio.usercoupon.domain;

import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.coupon.domain.Coupon;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@ToString(exclude = "user, coupon")
@EqualsAndHashCode(of = "userCpNo")
@Builder
@Table(name = "usercoupon")
public class UserCoupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userCpNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userNo", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpNo", nullable = false)
    private Coupon coupon;

    @Column(nullable = false, insertable = false, updatable = false)
    private LocalDateTime issueDt;

    @Column(length = 10)
    private String useAt;

    private LocalDateTime useDt;
}
