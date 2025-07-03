package com.wb.between.admin.main.service;

import com.wb.between.admin.main.dto.AdminBannerResDto;
import com.wb.between.admin.main.repository.AdminMainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminMainService {

    private final AdminMainRepository adminMainRepository;

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
