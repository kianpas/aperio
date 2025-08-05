package com.portfolio.aperio.menu.dto.response.user;

import com.portfolio.aperio.menu.domain.Menu;
import com.portfolio.aperio.menu.domain.MenuType;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MenuListResponseDto {

    // 기본 정보
    private Long menuId;

    private Long upperMenuId;

    private String name;

    private String description;

    private String menuUrl;

    // 상태 정보
    private Boolean isActive;

    private MenuType menuType;

    private Integer sortOrder;

    // 권한 정보
    private List<String> roleNames;

    /**
     * Menu 엔티티를 MenuListResponseDto로 변환
     */
    public static MenuListResponseDto from(Menu menu) {
        return MenuListResponseDto.builder()
                .menuId(menu.getMenuId())
                .upperMenuId(menu.getUpperMenuId())
                .name(menu.getName())
                .description(menu.getDescription())
                .menuUrl(menu.getMenuUrl())
                .isActive(menu.getIsActive())
                .menuType(menu.getMenuType())
                .sortOrder(menu.getSortOrder())
                .build();
    }

}
