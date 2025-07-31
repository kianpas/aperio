package com.portfolio.aperio.banner.repository;

import com.portfolio.aperio.banner.domain.Banner;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    //사용여부 기준, 정렬 조회
    List<Banner> findByUseAt(String useAt, Sort sort);
}
