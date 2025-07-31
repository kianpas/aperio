package com.portfolio.aperio.banner.repository;

import com.portfolio.aperio.banner.domain.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminBannerRepository extends JpaRepository<Banner, Long> {
}
