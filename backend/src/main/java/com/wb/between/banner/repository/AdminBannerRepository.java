package com.wb.between.banner.repository;

import com.wb.between.banner.domain.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminBannerRepository extends JpaRepository<Banner, Long> {
}
