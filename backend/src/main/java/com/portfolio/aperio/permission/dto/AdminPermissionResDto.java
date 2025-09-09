package com.portfolio.aperio.permission.dto;

import com.portfolio.aperio.permission.domain.Permission;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminPermissionResDto {

    private Long permissionId;

    private String permissionCode;

    private String permissionName;

    private String description;

    public static AdminPermissionResDto from(Permission permission) {
        return AdminPermissionResDto.builder()
                .permissionId(permission.getId())
                .permissionCode(permission.getCode())
                .permissionName(permission.getName())
                .description(permission.getDescription())
                .build();
    }

}
