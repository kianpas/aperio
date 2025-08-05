package com.portfolio.aperio.menu.dto.response.admin;


import com.portfolio.aperio.menu.domain.Menu;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AdminMenuResDto {

    private Long menuNo;

    private Long upperMenuNo;

    private String menuNm;

    private String menuDsc;

    private String menuUrl;

    private String useAt;

    private int sortOrder;

    private String menuType;

    private List<String> roleName;

    public static AdminMenuResDto from(Menu menu) {
        return AdminMenuResDto.builder()
                .menuNo(menu.getMenuId())
                .upperMenuNo(menu.getUpperMenuId())
                .menuNm(menu.getName())
                .menuDsc(menu.getDescription())
                .menuUrl(menu.getMenuUrl())
                // .useAt(menu.getUseAt())
                .sortOrder(menu.getSortOrder())
                // .menuType(menu.getMenuType())
                .build();
    }


}
