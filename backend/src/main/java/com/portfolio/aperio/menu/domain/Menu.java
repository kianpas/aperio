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
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "menus")
@ToString(exclude = {"menuRoles"})
@EqualsAndHashCode(of = "menuId")
@EntityListeners(AuditingEntityListener.class)
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long menuId;

    private Long upperMenuId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;
    
    @Column(length = 255)
    private String menuUrl;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private MenuType menuType = MenuType.MAIN_MENU;  // 기본값 설정

    @Column(nullable = false)
    private Integer sortOrder;

    // Audit 필드
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt; 



    // --- 새로운 @OneToMany 관계 추가 ---
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    // mappedBy: MenuRole 엔티티에 있는 'menu' 필드가 관계의 주인임을 명시
    // cascade: Menu 저장/삭제 시 MenuRole도 함께 처리
    // orphanRemoval: menu.getMenuRoles().remove(menuRole) 시 DB에서도 삭제
    // fetch: LAZY 로딩 권장
    @Builder.Default
    private Set<MenuRole> menuRoles = new HashSet<>();
}
