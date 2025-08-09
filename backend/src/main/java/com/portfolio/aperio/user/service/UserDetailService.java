package com.portfolio.aperio.user.service;

import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.repository.UserRepository;
import com.portfolio.aperio.role.domain.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByUsernameWithRolesAndPermissions(email)
                .orElseThrow(() -> {
                    log.warn("존재하지 않는 사용자 로그인 시도: {}", email);
                    return new UsernameNotFoundException("사용자를 찾을 수 없습니다. - " + email);
                });

        if (!user.isAccountNonLocked()) {
            log.warn("잠긴 계정 로그인 시도: {}", email);
            throw new LockedException("계정이 잠겨있습니다.");
        }

        if (!user.isEnabled()) {
            log.warn("비활성화된 계정 로그인 시도: {}", email);
            throw new DisabledException("계정이 비활성화되었습니다.");
        }

        log.debug("user with Role => {}", user);


        for (UserRole userRole : user.getUserRole()) {
            log.debug("role => {}", userRole.getRole());
        }

        return user;
    }


}
