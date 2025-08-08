package com.portfolio.aperio.menu.domain;

import com.portfolio.aperio.role.domain.MenuRole;
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
@Table(name = "menus")
@ToString(exclude = { "roles" })
@EqualsAndHashCode(of = "id")
@EntityListeners(AuditingEntityListener.class)
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 255)
    private String url;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 30)
    @Builder.Default
    private MenuType type = MenuType.MAIN_MENU; // 기본값 설정

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    // Audit 필드
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- 새로운 @OneToMany 관계 추가 ---
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<MenuRole> roles = new HashSet<>();

    // 비즈니스 메서드들
    public boolean hasParent() {
        return parentId != null;
    }

    /**
     * 메뉴가 활성화 상태인지 확인
     */
    public boolean isActive() {
        return Boolean.TRUE.equals(active);
    }

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
     * 역할 추가
     */    
    public void addRole(MenuRole role) {
        roles.add(role);
        role.setMenu(this);
    }

    /**
     * 역할 삭제
     */
    public void removeRole(MenuRole role) {
        roles.remove(role);
        role.setMenu(null);
    }

    // 비즈니스 메서드로 상태 변경
    public void updateBasicInfo(String name, String description, String url) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("메뉴명은 필수입니다.");
        }
        this.name = name;
        this.description = description;
        this.url = url;
    }
}
