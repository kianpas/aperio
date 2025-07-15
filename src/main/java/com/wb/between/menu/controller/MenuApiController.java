package com.wb.between.menu.controller;

import com.wb.between.common.cache.MenuCache;
import com.wb.between.menu.dto.MenuListResponseDto;
import com.wb.between.menu.service.MenuCacheService;
import com.wb.between.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuApiController {

    private final MenuCache menuCache;

    private final MenuCacheService menuCacheService;
    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuListResponseDto>> getAllMenus() {
        // 현재 사용자의 인증 정보를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<MenuListResponseDto> headerMenus = menuService.getHeaderMenuByRole(authentication);

        return ResponseEntity.ok(headerMenus);
    }

    @GetMapping("/menu-test")
    public String menuTest(Model model) {
        menuCache.reload();
        return "menu reloaded";
    }
}
