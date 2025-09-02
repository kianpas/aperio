package com.portfolio.aperio.auth.controller;

import com.portfolio.aperio.security.CustomUserDetails;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.request.user.LoginUserRequest;
import com.portfolio.aperio.user.dto.response.user.LoginUserResponse;
import com.portfolio.aperio.user.service.query.UserQueryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
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

    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    private final UserQueryService userQueryService;

    /**
     * 로그인
     * @param request
     * @param httpRequest
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginUserRequest request,
                                   HttpServletRequest httpRequest,
                                   HttpServletResponse httpResponse) {

        try {

            // 1) 아이디/비밀번호로 인증 시도
            UsernamePasswordAuthenticationToken authRequest =
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

            Authentication authentication = authenticationManager.authenticate(authRequest);

            // 2) SecurityContext 생성 및 Authentication 주입
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);

            // 3) 표준 방식으로 컨텍스트 저장 (세션 저장)
            securityContextRepository.saveContext(securityContext, httpRequest, httpResponse);

            // 4) principal에서 식별자만 꺼내 DB 재조회 (엔티티 캐스팅 금지)
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            String email = customUserDetails.getUsername();

            User user = userQueryService.findByEmail(email);

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
