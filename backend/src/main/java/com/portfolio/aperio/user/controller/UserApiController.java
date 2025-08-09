package com.portfolio.aperio.user.controller;

import com.portfolio.aperio.common.dto.ErrorResponse;
import com.portfolio.aperio.coupon.service.CouponIssueService;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.request.user.LgoinUserRequest;
import com.portfolio.aperio.user.dto.request.user.RegisterUserRequest;
import com.portfolio.aperio.user.dto.VerificationResult;
import com.portfolio.aperio.user.dto.response.user.LoginUserResponse;
import com.portfolio.aperio.user.dto.response.user.RegisterUserResponse;
import com.portfolio.aperio.user.service.UserService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;

    private final AuthenticationManager authenticationManager;

    private static final String OTP_PREFIX = "OTP_";

    private final CouponIssueService couponIssueService;

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

    /**
     * 이메일 중복체크
     * 
     * @param user
     * @return
     */
    @RateLimiter(name = "email-check", fallbackMethod = "emailCheckFallback")
    @GetMapping("/checkEmail")
    public ResponseEntity<?> checkEmail(@RequestBody User user) {

        // 1분에 10회로 제한
        boolean available = userService.isEmailAvailable(user.getEmail());

        return ResponseEntity.ok(Map.of("available", available));
    }

    /**
     * 중복체크 메소드
     * @param user
     * @param ex
     * @return
     */
    public ResponseEntity<?> emailCheckFallback(User user, Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        return ResponseEntity.status(429).body(response);
    }

    // 회원정보(email/pwd) 확인 페이지 호출
    @GetMapping("/findUserInfo")
    public String findUserInfoForm(Model model) {

        model.addAttribute("user", new User());

        return "login/findUserInfo";
    }


    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(
            // @Valid : SignupRequest 객체에서 설정한 유효성 검사 실행
            // BindingResult : 유효성 검사 결과를 담는 객체
            @Valid @RequestBody RegisterUserRequest request) {

        // try {

        log.debug("request = {}", request);

        // 회원가입 진행
        User user = userService.registerUser(request);

        log.debug("user = {}", user);
        // 쿠폰발급 진행, 쿠폰발급은 회원가입 흐름에 영향을 주지 않아야함
        // if(user != null) {
        // try {
        // couponIssueService.issueSignUpCoupon(user);
        // } catch (Exception e) {
        // log.error("회원가입 성공 후 쿠폰 발급 실패. 사용자: {}, 에러: {}", user.getUserId(),
        // e.getMessage(), e);
        // }
        // }

        RegisterUserResponse response = RegisterUserResponse.success(user);

        return ResponseEntity.ok(response);
        // } catch (Exception e) {
        // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        // .body(ErrorResponse.of("SERVER_ERROR", "서버 오류가 발생했습니다"));
        // }
    }

    // 휴대폰번호 인증번호 전송
    @PostMapping("/send-verification")
    @ResponseBody
    public Map<String, String> sendVerificationCode(@RequestBody Map<String, String> request, HttpSession session) {
        System.out.println("UserController|sendVerificationCode|시작 ==========> request : " + request);

        String phoneNo = request.get("phoneNo");
        String code = userService.generateAndSendVerificationCode(session, phoneNo);

        Map<String, String> response = new HashMap<>();
        response.put("success", "true");

        // response.put("code", code); // 디버깅용으로 클라이언트에 반환
        return response;

    }

    // 회원가입 > 휴대폰 인증번호 확인
    @PostMapping("/signup/verify-code")
    @ResponseBody
    public Map<String, Boolean> verifyCode(@RequestBody Map<String, String> request, HttpSession session) {
        System.out.println("UserController|verifyCode|시작 ==========> request : " + request);

        String phoneNo = request.get("phoneNo");
        String code = request.get("code");

        boolean isValid = userService.verifyCode(session, phoneNo, code);
        System.out.println("UserController|verifyCode|isValid : " + isValid);

        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);

        // 검증 성공 시 컨트롤러에서 세션 OTP 제거
        if (isValid) {
            session.removeAttribute(OTP_PREFIX + phoneNo); // 인증번호 세션 제거
            session.removeAttribute(OTP_PREFIX + phoneNo + "_expiry"); // 인증번호 만료 시간 세션 제거

            System.out.println("========== 세션에 저장된 인증번호 삭제 확인 ==========");
            Enumeration<String> attributeNames = session.getAttributeNames();
            while (attributeNames.hasMoreElements()) {
                String attributeName = attributeNames.nextElement();
                Object attributeValue = session.getAttribute(attributeName);
                System.out.println("키: " + attributeName + ", 값: " + attributeValue);
            }
            System.out.println("=================================================");
        }

        return response;
    }

    // 회원정보찾기 > 이메일 찾기 : 휴대번호로 인증 후 이메일 조회
    @PostMapping("/findUserInfo/verify-code")
    @ResponseBody
    public Map<String, Object> findEmailByVerifiedPhone(@RequestBody Map<String, String> request, HttpSession session) {
        System.out.println("UserController|findEmailByVerifiedPhone|시작 ==========> request : " + request);

        String phoneNo = request.get("phoneNo");
        String code = request.get("code");

        // 인증번호 검증 및 이메일 정보 조회
        VerificationResult result = userService.verifyAndGetUserByPhone(session, phoneNo, code);

        Map<String, Object> response = new HashMap<>();

        // 결과 상태(VerificationStatus)에 따라 분기
        switch (result.status()) {
            case SUCCESS:
                String email = result.email();
                System.out.println("UserController|findEmailByVerifiedPhone| 최종 성공: " + email);
                response.put("success", true);
                response.put("email", email);
                break;

            case USER_NOT_FOUND:
                System.out.println("UserController|findEmailByVerifiedPhone| 실패: 사용자 없음");
                response.put("success", false);
                response.put("message", "인증번호는 확인되었으나, 해당 번호로 가입된 사용자를 찾을 수 없습니다.");
                break;

            case OTP_INVALID_OR_EXPIRED:
                System.out.println("UserController|findEmailByVerifiedPhone| 실패: OTP 오류");
                response.put("success", false);
                response.put("message", "인증번호가 올바르지 않거나 만료되었습니다.");
                break;

            default:
                System.out.println("UserController|findEmailByVerifiedPhone| 실패: 알 수 없는 오류");
                response.put("success", false);
                response.put("message", "알 수 없는 오류가 발생했습니다.");
                break;
        }

        return response;
    }

    /**
     * [API] 비밀번호 찾기 - 1단계: 이메일 확인 및 OTP 발송 요청
     */
    @PostMapping("/findUserInfo/reqSendEmail")
    @ResponseBody
    public Map<String, Object> reqSendEmail(@RequestBody Map<String, String> request, HttpSession session) {
        System.out.println("UserController|requestPasswordOtp| 시작 ==========> email: " + request.get("email"));

        String email = request.get("email");

        Map<String, Object> response = new HashMap<>();

        try {
            // 회원여부 확인 > 인증번호 생성 > 메일 발송(세션저장)
            boolean requested = userService.requestPasswordOtp(email, session);
            response.put("success", requested);

            if (!requested) {
                response.put("message", "가입되지 않은 이메일이 입니다.");
            }
        } catch (Exception e) {
            System.err.println("UserController|requestPasswordOtp| 오류 발생: " + e.getMessage());
            e.printStackTrace(); // 로그 추가
            response.put("success", false);
            response.put("message", "처리 중 오류가 발생했습니다.");
        }
        return response;
    }

    /**
     * [API] 비밀번호 찾기 - 2단계: 이메일 인증번호 검증
     */
    @PostMapping("/findUserInfo/verifyPwdCode")
    @ResponseBody
    public Map<String, Object> verifyPwdCode(@RequestBody Map<String, String> request, HttpSession session) {
        System.out.println("UserController|verifyPasswordOtp| 시작 ==========> email: " + request.get("email")
                + ", code: " + request.get("code"));

        String email = request.get("email");
        String code = request.get("code");

        Map<String, Object> response = new HashMap<>();

        try {

            // 인증번호 및 유효시간 검증 > 유효 시 세션 제거
            boolean isValid = userService.verifyPasswordOtp(email, code, session);
            response.put("success", isValid);

            if (!isValid) {
                response.put("message", "인증번호가 올바르지 않거나 만료되었습니다.");
            }

        } catch (Exception e) {
            System.err.println("UserController|verifyPasswordOtp| 오류 발생: " + e.getMessage());
            e.printStackTrace(); // 로그 추가
            response.put("success", false);
            response.put("message", "처리 중 오류가 발생했습니다.");
        }
        return response;
    }

    /**
     * [API] 비밀번호 찾기 - 3단계: 새 비밀번호 설정
     * 
     * @Valid 추가하여 DTO 유효성 검사 가능
     */
    @PostMapping("/api/resetPwd")
    @ResponseBody
    public Map<String, Object> resetPwd(@Valid @RequestBody User user, BindingResult bindingResult) {
        System.out.println("UserController|resetPassword| 시작 ==========> email: " + user.getEmail());
        System.out.println("UserController|resetPassword| 시작 ==========> password: " + user.getPassword());
        Map<String, Object> response = new HashMap<>();

        // User Param(email) 유효성 검사 결과 확인
        if (bindingResult.hasErrors()) {
            System.out.println("UserController|resetPassword| 유효성 검사 실패");
            // 첫번째 에러 메시지만 전달하거나, 모든 에러를 조합할 수 있음
            response.put("success", false);
            response.put("message", bindingResult.getAllErrors().get(0).getDefaultMessage());
            return response;
        }

        try {
            boolean resetSuccess = userService.resetPassword(user.getEmail(), user.getPassword());
            response.put("success", resetSuccess);

            if (!resetSuccess) {
                response.put("message", "비밀번호 변경 중 오류가 발생했습니다.");
            }

        } catch (Exception e) {
            System.err.println("UserController|resetPassword| 오류 발생: " + e.getMessage());
            e.printStackTrace(); // 로그 추가
            response.put("success", false);
            response.put("message", "처리 중 오류가 발생했습니다.");
        }
        return response;
    }

}
