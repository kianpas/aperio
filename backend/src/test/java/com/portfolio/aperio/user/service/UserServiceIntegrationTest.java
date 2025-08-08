package com.portfolio.aperio.user.service;

import com.portfolio.aperio.role.domain.Role;
import com.portfolio.aperio.role.repository.RoleRepository;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.request.user.RegisterUserRequest;
import com.portfolio.aperio.user.repository.UserRepository;
import com.portfolio.aperio.user.testdata.UserTestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

/**
 * UserService 통합 테스트
 * 실제 Spring Context와 데이터베이스를 사용한 통합 테스트
 */
@SpringBootTest
@Transactional // 각 테스트 후 롤백
@ActiveProfiles("local") // 테스트 프로파일 사용
@DisplayName("UserService 통합 테스트")
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @BeforeEach
    void setUp() {
        // 테스트용 Role 데이터 준비
        if (roleRepository.findByCode("ROLE_USER").isEmpty()) {
            Role userRole = Role.builder()
                    .code("ROLE_USER")
                    .name("일반사용자")
                    .description("일반 사용자 권한")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            roleRepository.save(userRole);
        }

        if (roleRepository.findByCode("ROLE_STAFF").isEmpty()) {
            Role staffRole = Role.builder()
                    .code("ROLE_STAFF")
                    .name("임직원")
                    .description("임직원 권한")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            roleRepository.save(staffRole);
        }
    }

    @Test
    @DisplayName("일반 사용자 회원가입 통합 테스트")
    void registerUser_Integration_GeneralUser() {
        // Given
        RegisterUserRequest request = UserTestDataBuilder.createDefaultRegisterRequest();
        request.setEmail("integration.test@example.com"); // 고유한 이메일 사용

        // When
        User result = userService.registerUser(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUserId()).isNotNull(); // DB에서 자동 생성된 ID 확인
        assertThat(result.getEmail()).isEqualTo(request.getEmail());
        assertThat(result.getName()).isEqualTo(request.getName());
        assertThat(result.getPhoneNumber()).isEqualTo("01012345678"); // 하이픈 제거 확인
        assertThat(result.getUserRole()).hasSize(1);

        // DB에 실제로 저장되었는지 확인
        User savedUser = userRepository.findByEmail(request.getEmail()).orElse(null);
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo(request.getEmail());
        
        // 비밀번호가 암호화되어 저장되었는지 확인
        assertThat(savedUser.getPassword()).isNotEqualTo(request.getPassword());
        assertThat(savedUser.getPassword()).isNotEmpty();

        System.out.println("✅ 일반 사용자 회원가입 성공: " + result.getEmail());
    }

    @Test
    @DisplayName("임직원 회원가입 통합 테스트 - @aperio.kr 도메인")
    void registerUser_Integration_StaffUser() {
        // Given
        RegisterUserRequest request = UserTestDataBuilder.createStaffRegisterRequest();
        request.setEmail("integration.staff@aperio.kr"); // 고유한 이메일 사용

        // When
        User result = userService.registerUser(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(request.getEmail());
        assertThat(result.getUserRole()).hasSize(1);

        // ROLE_STAFF가 할당되었는지 확인
        boolean hasStaffRole = result.getUserRole().stream()
                .anyMatch(userRole -> "ROLE_STAFF".equals(userRole.getRole().getCode()));
        assertThat(hasStaffRole).isTrue();

        System.out.println("✅ 임직원 회원가입 성공: " + result.getEmail());
    }

    @Test
    @DisplayName("이메일 중복 확인 통합 테스트")
    void checkEmail_Integration_Test() {
        // Given - 먼저 사용자 등록
        RegisterUserRequest request = UserTestDataBuilder.createDefaultRegisterRequest();
        request.setEmail("duplicate.test@example.com");
        userService.registerUser(request);

        // When & Then - 같은 이메일로 중복 확인
        boolean isAvailable = userService.checkEmail("duplicate.test@example.com");
        assertThat(isAvailable).isFalse(); // 이미 사용 중이므로 false

        // 새로운 이메일은 사용 가능해야 함
        boolean isNewEmailAvailable = userService.checkEmail("new.email@example.com");
        assertThat(isNewEmailAvailable).isTrue();

        System.out.println("✅ 이메일 중복 확인 테스트 완료");
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 중복")
    void registerUser_Integration_FailWhenEmailDuplicate() {
        // Given - 먼저 사용자 등록
        RegisterUserRequest firstRequest = UserTestDataBuilder.createDefaultRegisterRequest();
        firstRequest.setEmail("duplicate.fail@example.com");
        userService.registerUser(firstRequest);

        // When & Then - 같은 이메일로 다시 등록 시도
        RegisterUserRequest duplicateRequest = UserTestDataBuilder.createDefaultRegisterRequest();
        duplicateRequest.setEmail("duplicate.fail@example.com");
        duplicateRequest.setName("다른사용자");

        assertThatThrownBy(() -> userService.registerUser(duplicateRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이미 사용 중인 이메일입니다.");

        System.out.println("✅ 이메일 중복 시 예외 발생 확인");
    }

    @Test
    @DisplayName("전화번호 하이픈 제거 확인")
    void registerUser_Integration_PhoneNumberFormatting() {
        // Given
        RegisterUserRequest request = UserTestDataBuilder.createDefaultRegisterRequest();
        request.setEmail("phone.test@example.com");
        request.setPhoneNumber("010-9876-5432"); // 하이픈 포함

        // When
        User result = userService.registerUser(request);

        // Then
        assertThat(result.getPhoneNumber()).isEqualTo("01098765432"); // 하이픈 제거됨
        
        // DB에서도 확인
        User savedUser = userRepository.findByEmail(request.getEmail()).orElse(null);
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getPhoneNumber()).isEqualTo("01098765432");

        System.out.println("✅ 전화번호 하이픈 제거 확인: " + result.getPhoneNumber());
    }

    @Test
    @DisplayName("다양한 도메인별 역할 할당 통합 테스트")
    void registerUser_Integration_RoleAssignmentByDomain() {
        // Given & When & Then
        // 1. 일반 도메인 - ROLE_USER 할당
        RegisterUserRequest generalRequest = UserTestDataBuilder.createDefaultRegisterRequest();
        generalRequest.setEmail("general@gmail.com");
        User generalUser = userService.registerUser(generalRequest);
        
        boolean hasUserRole = generalUser.getUserRole().stream()
                .anyMatch(userRole -> "ROLE_USER".equals(userRole.getRole().getCode()));
        assertThat(hasUserRole).isTrue();

        // 2. winbit.kr 도메인 - ROLE_STAFF 할당
        RegisterUserRequest staffRequest = UserTestDataBuilder.createStaffRegisterRequest();
        staffRequest.setEmail("employee@aperio.kr");
        User staffUser = userService.registerUser(staffRequest);
        
        boolean hasStaffRole = staffUser.getUserRole().stream()
                .anyMatch(userRole -> "ROLE_STAFF".equals(userRole.getRole().getCode()));
        assertThat(hasStaffRole).isTrue();

        System.out.println("✅ 도메인별 역할 할당 확인 완료");
        System.out.println("   - 일반 도메인: ROLE_USER");
        System.out.println("   - @winbit.kr: ROLE_STAFF");
    }
}