package com.portfolio.aperio.role.domain;

import com.portfolio.aperio.user.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "userRoleId")
@Table(name = "userrole")
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userRoleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_Id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_Id", nullable = false)
    private Role role;

    @CreationTimestamp
    @Column(name = "createDt",
            nullable = false,
            updatable = false)    // ← INSERT 시 컬럼 제외
    private LocalDateTime createDt;

}
