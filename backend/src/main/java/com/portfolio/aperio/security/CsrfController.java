package com.portfolio.aperio.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.web.csrf.CsrfToken;

@RestController
public class CsrfController {

    // CSRF 토큰을 필요한 클라이언트가 명시적으로 가져갈 수 있도록 제공하는 엔드포인트
    @GetMapping("/api/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }
}