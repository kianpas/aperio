package com.portfolio.aperio.security;

import com.portfolio.aperio.oauth.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    // 스프링 시큐리티 기능 비활성화
    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                .requestMatchers("/static/**", "/templates/**");
    }

    // 특정 HTTP 요청에 대한 웹 기반 보안 구성
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CookieCsrfTokenRepository repo = CookieCsrfTokenRepository.withHttpOnlyFalse();
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName("_csrf"); // 요청 처리 시 토큰 접근 명시

        http
                // CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 세션/쿠키 기반이면 활성 권장
                .csrf(csrf -> csrf
                        .csrfTokenRepository(repo)
                        .csrfTokenRequestHandler(requestHandler)
                        .ignoringRequestMatchers("/api/v1/auth/login", "/api/v1/accounts/signup",
                                "/api/v1/auth/logout", "/api/csrf"))

                // 예: 일부 훅/헬스체크나 외부콜백은 CSRF 제외
                // .ignoringRequestMatchers("/actuator/**", "/webhook/**")
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/css/**", "/js/**", "/img/**",
                                "/", "/main",
                                "/signup", "/api/v1/auth/signup", "/findUserInfo", "/checkEmail", "/send-verification",
                                "/login", "/api/v1/auth/login",
                                "/signup/verify-code", "/findUserInfo/verify-code",
                                "/findUserInfo/reqSendEmail", "/findUserInfo/verifyPwdCode", "/api/resetPwd",
                                "/faqList", "/error", "/favicon.ico", "/api/**",
                                "/oauth2/**", "/**")
                        .permitAll() // "/login" 누구나 접근 가능하게
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                // SecurityContext를 세션에 저장하도록 명시적 설정 추가 ⭐
                .securityContext(securityContext -> securityContext
                        .securityContextRepository(securityContextRepository()))
                // 세션 관리 설정 추가 ⭐
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 필요시 세션 생성
                        .maximumSessions(1) // 동시 세션 1개
                        .maxSessionsPreventsLogin(false) // 새 로그인 시 기존 세션 만료
                        .sessionRegistry(sessionRegistry()))
                // 4. 폼 기반 로그인 설정
                .formLogin(form -> form
                        .loginPage("/login") // 커스텀 로그인 페이지 지정
                        .defaultSuccessUrl("/") // 로그인 성공 시 이동할 URL (기본값은 '/')
                        .permitAll() // 로그인 페이지 자체는 모든 사용자가 접근 가능해야 함 (authorizeHttpRequests에서 이미 /login을 permitAll
                                     // 했으므로 중복될 수 있으나 명시적으로 추가 가능)
                )
                // 5. 로그아웃 설정
                .logout(logout -> logout
                        .logoutSuccessUrl("/") // 로그아웃 성공 시 이동할 URL
                        .invalidateHttpSession(true) // 로그아웃 시 세션 무효화
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID", "XSRF-TOKEN"))
                // // 6. CSRF 비활성화
                // .csrf(AbstractHttpConfigurer::disable) // .csrf(csrf -> csrf.disable()) 와 동일,
                // 메서드 레퍼런스 사용
                // 7. OAuth2 소셜 로그인 설정 추가
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login") // 로그인 페이지 지정 (인증이 필요할 때 이동)
                        // .defaultSuccessUrl("/") // 로그인 성공 시 이동할 URL (SuccessHandler 사용 시 주석 처리 가능)
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // 소셜 로그인 성공 후 사용자 정보 처리 서비스 지정
                        )
                        // 로그인 성공 핸들러 (선택적): 로그인 성공 후 특정 로직 수행 필요 시
                        .successHandler(oAuth2LoginSuccessHandler())
                        // 로그인 실패 핸들러 (선택적)
                        .failureHandler(oAuth2LoginFailureHandler()));

        return http.build();
    }

    // 인증 관리자 관련 설정
    /*
     *
     * AuthenticationManager Bean 정의 (Spring Security 6+ 스타일)
     * 이전 방식(http.getSharedObject(AuthenticationManagerBuilder.class))은 deprecated
     * 되었으므로,
     * DaoAuthenticationProvider를 직접 생성하고 설정하여 ProviderManager를 반환하는 방식을 사용합니다.
     * 
     * 
     */
    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailService userDetailService, // 사용자 정의 UserDetailsService 주입
            PasswordEncoder passwordEncoder) { // PasswordEncoder 주입

        // DaoAuthenticationProvider: UserDetailsService와 PasswordEncoder를 사용하여
        // 사용자 인증을 처리하는 AuthenticationProvider 구현체
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailService); // 사용자 정보 로드 서비스 설정
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder); // 비밀번호 인코더 설정

        // ProviderManager: 여러 AuthenticationProvider를 관리하고 인증 요청을 위임하는
        // AuthenticationManager의 표준 구현체
        // 여기서는 DaoAuthenticationProvider 하나만 사용합니다.
        return new ProviderManager(daoAuthenticationProvider);
    }

    // CORS: Next.js 도메인만 허용 + 쿠키 허용
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // 프론트 개발/운영 URL로 교체
        cfg.setAllowedOrigins(List.of(
                "http://localhost:3000", // React 개발 서버
                "http://localhost:3001", // 추가 개발 포트
                "http://localhost:63342", // IntelliJ 내장 서버
                "https://your-app.vercel.app" // 프로덕션 환경 (실제 도메인으로 변경 필요)
        ));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept",
                "X-Requested-With", " X-XSRF-TOKEN",
                "X-XSRF-TOKEN"));
        cfg.setAllowCredentials(true); // ★ 쿠키 전송 허용
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public SecurityContextHolderStrategy securityContextHolderStrategy() {
        return SecurityContextHolder.getContextHolderStrategy();
    }

    // --- 선택적: 로그인 성공/실패 핸들러 빈 등록 ---
    /*
    */
    @Bean
    public AuthenticationSuccessHandler oAuth2LoginSuccessHandler() {
        // 성공 시 로직 구현 (예: 첫 로그인 시 추가 정보 입력 페이지 이동 등)
        return (request, response, authentication) -> {
            // Custom 로직 수행
            response.sendRedirect("/"); // 예시: 성공 후 메인 페이지로 리다이렉트
        };
    }

    @Bean
    public AuthenticationFailureHandler oAuth2LoginFailureHandler() {
        // 실패 시 로직 구현 (예: 에러 메시지와 함께 로그인 페이지로 리다이렉트)
        return (request, response, exception) -> {
            // Custom 로직 수행 (로깅 등)
            response.sendRedirect("/login?error=oauth_fail"); // 예시: 실패 시 쿼리 파라미터와 함께 리다이렉트
        };
    }
}
