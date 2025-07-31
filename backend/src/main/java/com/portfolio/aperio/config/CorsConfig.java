package com.portfolio.aperio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer  {

    /**
     * Cors 설정
     * api 요청시 에러 방지
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",           // React 개발 서버
                        "http://localhost:3001",           // 추가 개발 포트
                        "http://localhost:63342",          // IntelliJ 내장 서버
                        "https://your-app.vercel.app"      // 프로덕션 환경 (실제 도메인으로 변경 필요)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // preflight 요청 캐시 시간 (1시간)
    }


}