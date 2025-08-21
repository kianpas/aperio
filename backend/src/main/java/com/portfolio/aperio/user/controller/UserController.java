package com.portfolio.aperio.user.controller;

import com.portfolio.aperio.common.util.AuthenticationHelper;
import com.portfolio.aperio.coupon.service.CouponIssueService;
import com.portfolio.aperio.user.dto.response.user.UserProfileResponse;
import com.portfolio.aperio.user.service.query.UserQueryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserQueryService userQueryService;

    private final AuthenticationHelper authHelper;

    private final CouponIssueService couponIssueService;

    /**
     * 현재 사용자 정보 조회
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(Authentication authentication, HttpServletRequest request) {
        // 세션 정보 로그 추가
        HttpSession session = request.getSession(false);
        if (session != null) {
            log.debug("/me 요청 - 세션 ID: {}", session.getId());
            log.debug("세션 생성 시간: {}", session.getCreationTime());
            log.debug("세션 마지막 접근: {}", session.getLastAccessedTime());
        } else {
            log.debug("/me 요청 - 세션 없음");
        }

        log.debug("Authentication 객체: {}", authentication);

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        Object principal = authentication.getPrincipal();
        String email = authHelper.extractEmail(principal);
        String name = null;

        //TODO: dto로 변경
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "user", Map.of(
                        "email", email,
                        "name", (name != null && !name.isBlank()) ? name : email
                )
        ));
    }

    /**
     * 사용자 프로필 조회
     */
    @GetMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "UNAUTHORIZED",
                    "message", "로그인이 필요합니다."
            ));
        }

        Object principal = authentication.getPrincipal();
        // 1) userId 우선
        Long userId = authHelper.extractUserId(principal);

        if(userId != null) {
            UserProfileResponse userProfileResponse = userQueryService.getUserProfileById(userId);
            return ResponseEntity.ok(userProfileResponse);
        }

        // 2) 보조: email로 조회 (userId 미탑재 OAuth2 등을 대비)
        String email = authHelper.extractEmail(authentication.getPrincipal());
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "BAD_PRINCIPAL",
                    "message", "인증 정보에서 이메일을 확인할 수 없습니다."
            ));
        }

        UserProfileResponse userProfileResponse = userQueryService.getUserProfileByEmail(email);

        return ResponseEntity.ok(userProfileResponse);
    }



}
