package com.wb.between.admin.main.repository;

import com.wb.between.banner.domain.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminMainRepository extends JpaRepository<Banner, Long> {
}
