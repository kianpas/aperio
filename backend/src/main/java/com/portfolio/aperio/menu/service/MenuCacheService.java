package com.portfolio.aperio.menu.service;

import com.portfolio.aperio.menu.domain.Menu;
import com.portfolio.aperio.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuCacheService {

    private final MenuRepository menuRepository;

    /**
     * 메뉴 목록 전체 조회
     * @return
     */
    @Cacheable(cacheNames = "headerMenus", key = "'global'")
    public List<Menu> getAllHeaderMenu() {
        return menuRepository.findByUseAt("Y", Sort.by(Sort.Direction.ASC, "menuNo"));
    }

    /** 메뉴가 변경됐을 때(관리자 수정 등) 캐시를 비우고 새로 로딩 */
    @CacheEvict(cacheNames = "headerMenus", key = "'global'")
    public void refreshHeaderMenus() {
        // 빈 메서드. @CacheEvict만으로 캐시 초기화.
    }
}
