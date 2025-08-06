package com.portfolio.aperio.menu.dto.request.admin;

import com.portfolio.aperio.menu.domain.Menu;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AdminMenuRegistReqDto {

    private Long menuNo;

    private Long upperMenuNo;

    private String menuNm;

    private String menuDsc;

    private String menuUrl;

    private String useAt;

    private int sortOrder;

    private String menuType;

    private List<String> roleName;

    public static AdminMenuRegistReqDto from(Menu menu) {
        return AdminMenuRegistReqDto.builder()
                .menuNo(menu.getId())
                .upperMenuNo(menu.getParentId())
                .menuNm(menu.getName())
                .menuDsc(menu.getDescription())
                .menuUrl(menu.getUrl())
                .useAt(menu.getActive() != null && menu.getActive() ? "Y" : "N")
                .sortOrder(menu.getSortOrder())
                .menuType(menu.getType() != null ? menu.getType().name() : "")
                .build();
    }

}
