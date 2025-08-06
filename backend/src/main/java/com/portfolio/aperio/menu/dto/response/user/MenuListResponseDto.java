package com.portfolio.aperio.menu.dto.response.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.portfolio.aperio.menu.domain.Menu;
import com.portfolio.aperio.menu.domain.MenuType;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MenuListResponseDto {

    // 기본 정보
    private Long id;
    
    private Long parentId;

    private String name;

    private String description;

    private String url;

    private Boolean active;

    private MenuType type;

    private Integer sortOrder;

    // 권한 정보
    @JsonProperty("roleNames")
    private List<String> roleNames;

    /**
     * Menu 엔티티를 MenuListResponseDto로 변환
     */
    public static MenuListResponseDto from(Menu menu) {
        return MenuListResponseDto.builder()
                .id(menu.getId())                  
                .parentId(menu.getParentId())      
                .name(menu.getName())              
                .description(menu.getDescription())
                .url(menu.getUrl())                
                .active(menu.getActive())          
                .type(menu.getType())              
                .sortOrder(menu.getSortOrder())    
                .build();
    }

}
