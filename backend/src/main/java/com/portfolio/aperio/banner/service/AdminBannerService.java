package com.portfolio.aperio.banner.service;

import com.portfolio.aperio.banner.dto.response.admin.AdminBannerResDto;
import com.portfolio.aperio.banner.repository.AdminBannerRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBannerService {

    private final AdminBannerRepository adminMainRepository;

    /**
     * 관리자 > 배너 조회
     * @return
     */
    public List<AdminBannerResDto> findAll() {
        return adminMainRepository.findAll()
                .stream()
                .map(AdminBannerResDto::from)
                .toList();
    }



}
