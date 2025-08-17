package com.portfolio.aperio.auth.controller;

import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.request.user.LgoinUserRequest;
import com.portfolio.aperio.user.dto.response.user.LoginUserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    /**
     * 로그인
     * @param request
     * @param httpRequest
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LgoinUserRequest request, HttpServletRequest httpRequest) {

        try {

            // 인증정보 조회
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            // SecurityContext에 인증 정보 설정
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);

            // 세션에 SecurityContext 명시적으로 저장 ⭐
            HttpSession session = httpRequest.getSession();
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
            // 세션 확인 로그 추가
            log.debug("로그인 성공 - 세션 ID: {}", session.getId());
            log.debug("SecurityContext 저장됨: {}", securityContext.getAuthentication().getName());

            // 인증된 사용자 정보
            User user = (User) authentication.getPrincipal();
            // 응답 객체 생성
            LoginUserResponse response = LoginUserResponse.from(user);

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            log.warn("로그인 실패: {}, 사유: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(401)
                    .body(Map.of("error", "AUTHENTICATION_FAILED",
                            "message", "이메일 또는 비밀번호가 올바르지 않습니다."));
        }

    }

    /**
     * 로그아웃
     * @param request
     * @return
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {

        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(Map.of("message", "로그아웃 되었습니다."));
    }


}
