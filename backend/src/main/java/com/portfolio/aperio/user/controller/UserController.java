package com.portfolio.aperio.user.controller;

import com.portfolio.aperio.coupon.service.CouponIssueService;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.response.user.UserProfileResponse;
import com.portfolio.aperio.user.service.query.UserQueryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserQueryService userQueryService;

    private final CouponIssueService couponIssueService;

    /**
     * 현재 사용자 정보 조회
     * @param authentication
     * @return
     */
    @GetMapping("/me")
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

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "user", Map.of(
                        "email", user.getEmail(),
                        "name", user.getName() != null ? user.getName() : user.getEmail()
                )
        ));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication, HttpServletRequest request) {
        User user = (User) authentication.getPrincipal();

        UserProfileResponse userProfileResponse = userQueryService.getUserProfile(user.getUserId());

        return ResponseEntity.ok(userProfileResponse);
    }




}
