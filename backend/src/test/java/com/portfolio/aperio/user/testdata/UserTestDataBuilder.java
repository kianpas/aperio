package com.portfolio.aperio.user.testdata;

import com.portfolio.aperio.role.domain.Role;
import com.portfolio.aperio.user.domain.LoginMethod;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.domain.UserStatus;
import com.portfolio.aperio.user.dto.request.user.RegisterUserRequest;

import java.time.LocalDateTime;

/**
 * 테스트용 데이터 빌더 클래스
 * 테스트에서 사용할 User 관련 객체들을 쉽게 생성할 수 있도록 도와주는 유틸리티 클래스
 */
public class UserTestDataBuilder {

    /**
     * 기본 회원가입 요청 데이터 생성
     */
    public static RegisterUserRequest createDefaultRegisterRequest() {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setName("테스트사용자");
        request.setPhoneNumber("010-1234-5678");
        return request;
    }

    /**
     * 임직원용 회원가입 요청 데이터 생성 (@aperio.kr 도메인)
     */
    public static RegisterUserRequest createStaffRegisterRequest() {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setEmail("staff@aperio.kr");
        request.setPassword("password123");
        request.setName("임직원사용자");
        request.setPhoneNumber("010-9876-5432");
        return request;
    }

    /**
     * 커스텀 이메일로 회원가입 요청 데이터 생성
     */
    public static RegisterUserRequest createRegisterRequestWithEmail(String email) {
        RegisterUserRequest request = createDefaultRegisterRequest();
        request.setEmail(email);
        return request;
    }

    /**
     * 기본 User 엔티티 생성
     */
    public static User createDefaultUser() {
        return User.builder()
                .id(1L)
                .email("test@example.com")
                .password("12345678")
                .name("테스트사용자")
                .phoneNumber("01012345678")
                .userStatus(UserStatus.ACTIVE)
                .loginMethod(LoginMethod.EMAIL)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * 기본 Role 엔티티 생성 (ROLE_USER)
     */
    public static Role createUserRole() {
        return Role.builder()
                .id(1L)
                .code("ROLE_USER")
                .name("일반사용자")
                .description("일반 사용자 권한")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * 임직원 Role 엔티티 생성 (ROLE_STAFF)
     */
    public static Role createStaffRole() {
        return Role.builder()
                .id(2L)
                .code("ROLE_STAFF")
                .name("임직원")
                .description("임직원 권한")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * 중복 이메일 테스트용 요청 데이터
     */
    public static RegisterUserRequest createDuplicateEmailRequest() {
        RegisterUserRequest request = new RegisterUserRequest();
        request.setEmail("duplicate@example.com");
        request.setPassword("password123");
        request.setName("중복테스트");
        request.setPhoneNumber("010-1111-2222");
        return request;
    }
}