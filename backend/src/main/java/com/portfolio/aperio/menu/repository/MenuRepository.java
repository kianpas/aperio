package com.portfolio.aperio.menu.repository;

import com.portfolio.aperio.menu.domain.Menu;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByUseAt(String useAt, Sort sort);
}
