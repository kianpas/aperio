package com.wb.between.menu.service;

import com.wb.between.menu.dto.request.admin.AdminMenuEditReqDto;
import com.wb.between.menu.dto.request.admin.AdminMenuRegistReqDto;
import com.wb.between.role.domain.Role;
import com.wb.between.common.exception.CustomException;
import com.wb.between.common.exception.ErrorCode;
import com.wb.between.menu.domain.Menu;
import com.wb.between.menu.dto.response.user.MenuListResponseDto;
import com.wb.between.menu.repository.MenuRepository;
import com.wb.between.role.domain.MenuRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    private final MenuCacheService menuCacheService;

    /**
     * 메뉴목록 조회
     * @return
     */
    @Transactional(readOnly = true)
    public List<MenuListResponseDto> findMenuList() {

        //메뉴목록 조회
        List<Menu> menuList = menuRepository.findByUseAt("Y", Sort.by(Sort.Direction.ASC, "menuNo"));
        log.debug("menuList: {}", menuList);

        //결과 없을 경우
        if(menuList.isEmpty()) {
            throw new CustomException(ErrorCode.MENU_NOT_FOUND);
        }

        return menuList.stream().map(MenuListResponseDto::from).toList();
    }

    /**
     * 메뉴 목록 전체 조회
     * @return
     */
    public List<MenuListResponseDto> findByUseAt() {
        List<Menu> menuList = menuRepository.findByUseAt("Y", Sort.by(Sort.Direction.ASC, "menuNo"));

        return menuList.stream()
                .map(MenuListResponseDto::from).toList();
    }

    /**
     * 메뉴 권한별 조회
     * @param roles
     * @return
     */
    public List<MenuListResponseDto> findByRole(String roles) {
        List<Menu> menuList = menuRepository.findByUseAt("Y", Sort.by(Sort.Direction.ASC, "menuNo"));

        return menuList.stream()
                .map(MenuListResponseDto::from).toList();
    }


    /******************************
     * 캐시 메뉴 조회 처리
     ******************************/

    /**
     * 메뉴 목록 역할별 필터링
     * @param authentication
     * @return
     */
    public List<MenuListResponseDto> getHeaderMenuByRole(Authentication authentication) {

        Set<String> roles;
        //인증여부에 따른 역할 처리
        if(authentication == null || !authentication.isAuthenticated()) {
            roles = Set.of("ROLE_ANONYMOUS");
        } else {
            roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());
        }

        log.debug("getHeaderMenuByRole|roles => {}", roles);

        List<Menu> allHeaderMenu = menuCacheService.getAllHeaderMenu();
        
        //메뉴 역할 필터 후 리턴
        return allHeaderMenu.stream()
                .filter(menu -> {
                    Set<String> menuAllowedRoles = getMenuAllowedRoleNames(menu);
                    log.debug("menuAllowedRoles = {}", menuAllowedRoles);
                    // menuAllowedRoles 가 비어있으면 공개
                    if (menuAllowedRoles.isEmpty()) {
                        return roles.contains("ROLE_ANONYMOUS");
                    }
                    return roles.stream().anyMatch(menuAllowedRoles::contains);
                })
                .map(MenuListResponseDto::from).toList();
    }

    /**
     * Menu 객체에서 허용된 역할 이름(String) Set을 안전하게 추출합니다.
     * (Menu 엔티티가 MenuRole Set을 가지고 있고, MenuRole이 Role을 참조한다고 가정)
     */
    private Set<String> getMenuAllowedRoleNames(Menu menu) {
        if (menu == null || menu.getMenuRoles() == null || menu.getMenuRoles().isEmpty()) {
            return Collections.emptySet();
        }
        return menu.getMenuRoles().stream()
                .map(MenuRole::getRole)      // MenuRole -> Role 추출
                .filter(Objects::nonNull)    // null Role 객체 필터링
                .map(Role::getRoleCode)      // Role -> 역할 이름(String) 추출
                .filter(Objects::nonNull)    // null 역할 이름 필터링
                .collect(Collectors.toSet());
    }



    /**
     * 관리자 > 메뉴 등록
     * @param adminMenuRegistReqDto
     */
    @Transactional
    public void registMenu(AdminMenuRegistReqDto adminMenuRegistReqDto) {
        Menu menu = Menu.builder()
                .menuUrl(adminMenuRegistReqDto.getMenuUrl())
                .menuType(adminMenuRegistReqDto.getMenuType())
                .upperMenuNo(adminMenuRegistReqDto.getUpperMenuNo())
                .useAt(adminMenuRegistReqDto.getUseAt())
                .menuNm(adminMenuRegistReqDto.getMenuNm())
                .menuDsc(adminMenuRegistReqDto.getMenuDsc())
                .createDt(LocalDateTime.now())
                .sortOrder(adminMenuRegistReqDto.getSortOrder())
                .build();

        adminMenuRepository.save(menu);
    }

    /**
     * 관리자 > 메뉴 수정
     * @param menuNo
     * @param adminMenuEditReqDto
     */
    @Transactional
    public void editMenu(Long menuNo, AdminMenuEditReqDto adminMenuEditReqDto) {
        Menu menu = adminMenuRepository.findById(menuNo).orElseThrow(() -> new CustomException(ErrorCode.MENU_NOT_FOUND));

        menu.setMenuNm(adminMenuEditReqDto.getMenuNm());
        menu.setMenuDsc(adminMenuEditReqDto.getMenuDsc());
        menu.setSortOrder(adminMenuEditReqDto.getSortOrder());
        menu.setUseAt(adminMenuEditReqDto.getUseAt());
        menu.setUpperMenuNo(adminMenuEditReqDto.getUpperMenuNo());
        menu.setMenuType(adminMenuEditReqDto.getMenuType());
        menu.setMenuUrl(adminMenuEditReqDto.getMenuUrl());

    }


}
