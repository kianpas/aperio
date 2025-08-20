package com.portfolio.aperio.user.controller;

import com.portfolio.aperio.coupon.service.CouponIssueService;
import com.portfolio.aperio.security.CustomUserDetails;
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

        Object principal = authentication.getPrincipal();
        String email = extractEmail(principal);
        String name = null;

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "user", Map.of(
                        "email", email,
                        "name", (name != null && !name.isBlank()) ? name : email
                )
        ));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "UNAUTHORIZED",
                    "message", "로그인이 필요합니다."
            ));
        }

        Object principal = authentication.getPrincipal();
        // 1) userId 우선
        Long userId = extractUserId(principal);

        if(userId != null) {
            UserProfileResponse userProfileResponse = userQueryService.getUserProfileById(userId);
            return ResponseEntity.ok(userProfileResponse);
        }

        // 2) 보조: email로 조회 (userId 미탑재 OAuth2 등을 대비)
        String email = extractEmail(authentication.getPrincipal());
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(400).body(Map.of(
                    "error", "BAD_PRINCIPAL",
                    "message", "인증 정보에서 이메일을 확인할 수 없습니다."
            ));
        }

        UserProfileResponse userProfileResponse = userQueryService.getUserProfileByEmail(email);

        return ResponseEntity.ok(userProfileResponse);
    }

    // principal에서 아이디를 꺼내는 유틸 (폼/OAuth2 모두 대응)
    public Long extractUserId(Object principal) {
        if (principal instanceof CustomUserDetails cud) {
            return cud.getUserId();
        }
        //TODO: CustomOAuth2User 생성 필요
//        if (principal instanceof CustomOAuth2User cou) { // 커스텀 OAuth2User 사용 시
//            return cou.getUserId();
//        }
        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User ou) {
            Object id = ou.getAttributes().get("userId"); // DefaultOAuth2User에 userId 심어둔 경우
            if (id instanceof Number n) return n.longValue();
        }
        return null;
    }

    // principal에서 이메일/표시명을 꺼내는 유틸 (폼/OAuth2 모두 대응)
    private String extractEmail(Object principal) {
        if (principal instanceof CustomUserDetails cud) {
            return cud.getUsername();
        }
        if (principal instanceof org.springframework.security.core.userdetails.User u) {
            return u.getUsername();
        }
        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User ou) {
            Object email = ou.getAttributes().get("email");
            if (email == null && ou.getAttributes().get("response") instanceof Map<?,?> resp) {
                email = ((Map<?,?>) resp).get("email"); // 네이버
            }
            return email != null ? email.toString() : null;
        }
        return null;
    }

}
