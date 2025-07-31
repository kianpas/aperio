package com.portfolio.aperio.mypage.repository;

import com.portfolio.aperio.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MypageRepository extends JpaRepository<User, Long> {

    @Override
    Optional<User> findById(Long userNo);

}
