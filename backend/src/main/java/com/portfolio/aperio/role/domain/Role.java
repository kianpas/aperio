package com.portfolio.aperio.role.domain;

import com.portfolio.aperio.permission.domain.RolePermission;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 요구사항 + 무분별한 생성 방지
@AllArgsConstructor(access = AccessLevel.PRIVATE) // 빌더 전용
@Getter
@Table(name = "roles")
@ToString(exclude = {"rolePermissions"}) // 순환 참조 방지
@EqualsAndHashCode(of = "id") // ID 기반 동등성 비교
@EntityListeners(AuditingEntityListener.class)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Role과 RolePermission의 일대다(1:N) 관계
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default // 빌더 사용 시 초기화 보장
    private Set<RolePermission> rolePermissions = new HashSet<>();

      // === 비즈니스 메서드 ===
    
    /**
     * 역할 활성화
     */
    public void activate() {
        this.active = true;
    }

    /**
     * 역할 비활성화
     */
    public void deactivate() {
        this.active = false;
    }

    /**
     * 역할이 활성화 상태인지 확인
     */
    public boolean isActive() {
        return Boolean.TRUE.equals(active);
    }

    /**
     * 권한 추가
     */
    public void addPermission(RolePermission permission) {
        rolePermissions.add(permission);
        permission.setRole(this);
    }

    /**
     * 권한 제거
     */
    public void removePermission(RolePermission permission) {
        rolePermissions.remove(permission);
        permission.setRole(null);
    }

    /**
     * 역할 기본 정보 업데이트
     */
    public void updateBasicInfo(String name, String description) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("역할명은 필수입니다.");
        }
        this.name = name;
        this.description = description;
    }

    /**
     * 특정 권한을 가지고 있는지 확인
     */
    public boolean hasPermission(String permissionCode) {
        return rolePermissions.stream()
                .anyMatch(rp -> permissionCode.equals(rp.getPermission().getCode()));
    }

    /**
     * 시스템 역할인지 확인 (ROLE_ADMIN, ROLE_SYSTEM 등)
     */
    public boolean isSystemRole() {
        return code != null && (
            code.equals("ROLE_ADMIN") || 
            code.equals("ROLE_SYSTEM")
        );
    }

}
