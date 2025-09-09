package com.portfolio.aperio.permission.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "permissions")
@EqualsAndHashCode(of = "id")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String code; // 예: COUPON:CREATE

    @Column(nullable = false, length = 100)
    private String name; // 예: 쿠폰 생성

    private String description;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // DB: created_at

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // DB: updated_at

    

    // Role과의 관계는 Role 쪽에서 @JoinTable로 관리하므로 여기서는 명시적 매핑 불필요 (단방향 ManyToMany)
    // 양방향을 원하면 @ManyToMany(mappedBy = "permissions") 추가 가능
}
