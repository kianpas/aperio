package com.portfolio.aperio.common.util;

import com.portfolio.aperio.oauth.domain.CustomOAuth2User;
import com.portfolio.aperio.security.CustomUserDetails;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AuthenticationHelper {

    // principal에서 아이디를 꺼내는 유틸 (폼/OAuth2 모두 대응)
    public Long extractUserId(Object principal) {
        if (principal instanceof CustomUserDetails cud) {
            return cud.getUserId();
        }

        if (principal instanceof CustomOAuth2User cou) { // 커스텀 OAuth2User 사용 시
            return cou.getUserId();
        }

        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User ou) {
            Object id = ou.getAttributes().get("userId"); // DefaultOAuth2User에 userId 심어둔 경우
            if (id instanceof Number n) return n.longValue();
        }

        return null;
    }

    // principal에서 이메일/표시명을 꺼내는 유틸 (폼/OAuth2 모두 대응)
    public String extractEmail(Object principal) {
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
