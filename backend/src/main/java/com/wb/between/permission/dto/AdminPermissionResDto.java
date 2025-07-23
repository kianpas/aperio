package com.wb.between.permission.dto;

import com.wb.between.permission.domain.Permission;
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
                .permissionId(permission.getPermissionId())
                .permissionCode(permission.getPermissionCode())
                .permissionName(permission.getPermissionName())
                .description(permission.getDescription())
                .build();
    }

}
