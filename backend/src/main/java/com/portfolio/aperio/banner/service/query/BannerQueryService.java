package com.portfolio.aperio.banner.service.query;

import com.portfolio.aperio.banner.domain.Banner;
import com.portfolio.aperio.banner.dto.response.admin.AdminBannerResponse;
import com.portfolio.aperio.banner.dto.response.user.BannerResponse;
import com.portfolio.aperio.banner.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerQueryService {

    private final BannerRepository bannerRepository;

    /**
     * 배너목록 조회
     * 
     * @return
     */
    @Transactional(readOnly = true)
    public List<BannerResponse> findBannerList() {

        // 배너목록 조회
        List<Banner> bannerList = bannerRepository.findByActiveTrue(Sort.by(Sort.Direction.DESC, "createdAt"));
        log.debug("bannerList: {}", bannerList);

        // 결과 없을 경우
        // if(bannerList.isEmpty()) {
        // throw new CustomException(ErrorCode.BANNER_NOT_FOUND);
        // }

        return bannerList.stream().map(BannerResponse::from).toList();
    }

    /**
     * 관리자 > 배너 조회
     * 
     * @return
     */
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<AdminBannerResponse> findAll() {
        return bannerRepository.findAll()
                .stream()
                .map(AdminBannerResponse::from)
                .toList();
    }

}
