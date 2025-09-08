package com.portfolio.aperio.security;

import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.repository.UserRepository;
import com.portfolio.aperio.role.domain.UserRole;
import com.portfolio.aperio.user.service.query.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserDetailService implements UserDetailsService {

    private final UserQueryService userQueryService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userQueryService.findByEmail(email);
        log.debug("user with Role => {}", user);

//        if (!user.isAccountNonLocked()) {
//            log.warn("잠긴 계정 로그인 시도: {}", email);
//            throw new LockedException("계정이 잠겨있습니다.");
//        }
//
//        if (!user.isEnabled()) {
//            log.warn("비활성화된 계정 로그인 시도: {}", email);
//            throw new DisabledException("계정이 비활성화되었습니다.");
//        }

        for (UserRole userRole : user.getUserRoles()) {
            log.debug("role => {}", userRole.getRole());
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        for (UserRole ur : user.getUserRoles()) {
            authorities.add(new SimpleGrantedAuthority(ur.getRole().getCode())); // "ROLE_..."
        }

        UserDetails userDetails = CustomUserDetails.builder()
                .userId(user.getId())
                .username(user.getEmail())
                .password(user.getPassword())
//                .enabled(user.isEnabled())
//                .accountNonLocked(user.isAccountNonLocked())
                .authorities(authorities)
                .build();

        return userDetails;
    }


}
