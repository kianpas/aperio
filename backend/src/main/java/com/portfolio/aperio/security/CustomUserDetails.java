package com.portfolio.aperio.security;

import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long userId;

    private final String username;

    private final String password;

    private final boolean enabled;

    private final boolean accountNonLocked;

    private final List<GrantedAuthority> authorities;

    @Builder
    private CustomUserDetails(
                              Long userId,
                              String username,
                              String password,
                              Boolean enabled,
                              Boolean accountNonLocked,
                              List<GrantedAuthority> authorities) {
        this.userId = Objects.requireNonNull(userId, "userId");
        this.username = Objects.requireNonNull(username, "username");
        this.password = Objects.requireNonNull(password, "password");
        this.enabled = enabled != null ? enabled.booleanValue() : true;
        this.accountNonLocked = accountNonLocked != null ? accountNonLocked.booleanValue() : true;
        this.authorities = List.copyOf(Objects.requireNonNullElse(authorities, List.of()));
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }
    @Override public boolean isAccountNonLocked() { return accountNonLocked; }

}
