package com.wb.between.common.entity;

import com.wb.between.common.entity.Permission;
import com.wb.between.common.entity.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "rolePermissionId")
@Table(name = "rolepermission")
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rolePermissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roleId", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permissionId", nullable = false)
    private Permission permission;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createDt; // 권한 부여 시점 등 관계 자체의 속성 추가 가능

}
