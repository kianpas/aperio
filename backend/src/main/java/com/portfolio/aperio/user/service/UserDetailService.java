package com.portfolio.aperio.user.service;


import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.repository.UserRepository;
import com.portfolio.aperio.role.domain.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserDetailService implements UserDetailsService {

//    private final UserRepositoryBM userRepositoryBM;
    private final UserRepository userRepositoryBM;

    @Override
//    public UserBM loadUserByUsername(String email){
    public User loadUserByUsername(String email){

        User user = userRepositoryBM.findByUsernameWithRolesAndPermissions(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다. - " + email));


        log.debug("user with Role => {}", user);

        log.debug("user with Role|getUserRole => {}", user.getUserRole());

        for(UserRole userRole : user.getUserRole()) {
            log.debug("role => {}", userRole.getRole());
        }


//        return userRepositoryBM.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다. - " + email));

        return user;
    }
}
