package com.wb.between.menu.dto.response.admin;


import com.wb.between.role.dto.AdminRoleResDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Set;

@Getter
@Builder
public class MenuDetailResDto {

    private AdminMenuResDto adminMenuResDto;

    private List<AdminRoleResDto> allRoleDto;

    private Set<Long> assignedRoleIds;


}
