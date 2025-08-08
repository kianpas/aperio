package com.portfolio.aperio.user.service;

import com.portfolio.aperio.role.domain.Role;
import com.portfolio.aperio.role.repository.RoleRepository;
import com.portfolio.aperio.user.domain.User;
import com.portfolio.aperio.user.dto.request.user.RegisterUserRequest;
import com.portfolio.aperio.user.repository.UserRepository;
import com.portfolio.aperio.user.testdata.UserTestDataBuilder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * UserService 단위 테스트
 * Mock을 사용하여 의존성을 격리하고 빠른 테스트 실행
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService 단위 테스트")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("일반 사용자 회원가입 성공 - ROLE_USER 할당")
    void registerUser_Success_GeneralUser() {
        // Given
        RegisterUserRequest request = UserTestDataBuilder.createDefaultRegisterRequest();
        Role userRole = UserTestDataBuilder.createUserRole();
        
        when(userRepository.checkEmail(request.getEmail())).thenReturn(false);
        when(roleRepository.findByCode("ROLE_USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword123");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(1L); // ID 설정 (실제 DB에서는 자동 생성)
            return user;
        });

        // When
        User result = userService.registerUser(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(request.getEmail());
        assertThat(result.getName()).isEqualTo(request.getName());
        assertThat(result.getPhoneNumber()).isEqualTo("01012345678"); // 하이픈 제거됨
        assertThat(result.getPassword()).isEqualTo("encodedPassword123");
        assertThat(result.getUserRole()).hasSize(1);
        
        // 검증
        verify(userRepository).checkEmail(request.getEmail());
        verify(roleRepository).findByCode("ROLE_USER");
        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("임직원 회원가입 성공 - @aperio.kr 도메인으로 ROLE_STAFF 할당")
    void registerUser_Success_StaffUser() {
        // Given
        RegisterUserRequest request = UserTestDataBuilder.createStaffRegisterRequest();
        Role staffRole = UserTestDataBuilder.createStaffRole();
        
        when(userRepository.checkEmail(request.getEmail())).thenReturn(false);
        when(roleRepository.findByCode("ROLE_STAFF")).thenReturn(Optional.of(staffRole));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword123");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(2L);
            return user;
        });

        // When
        User result = userService.registerUser(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("staff@aperio.kr");
        assertThat(result.getUserRole()).hasSize(1);
        
        // ROLE_STAFF가 할당되었는지 확인
        verify(roleRepository).findByCode("ROLE_STAFF");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("이메일 중복 시 예외 발생")
    void registerUser_ThrowsException_WhenEmailExists() {
        // Given
        RegisterUserRequest request = UserTestDataBuilder.createDuplicateEmailRequest();
        when(userRepository.checkEmail(request.getEmail())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이미 사용 중인 이메일입니다.");

        // 이메일 중복 확인 후 더 이상 진행되지 않음을 검증
        verify(userRepository).checkEmail(request.getEmail());
        verify(roleRepository, never()).findByCode(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("역할 조회 실패 시 예외 발생")
    void registerUser_ThrowsException_WhenRoleNotFound() {
        // Given
        RegisterUserRequest request = UserTestDataBuilder.createDefaultRegisterRequest();
        when(userRepository.checkEmail(request.getEmail())).thenReturn(false);
        when(roleRepository.findByCode("ROLE_USER")).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("역할을 찾을 수 없습니다. 시스템 설정 오류입니다.");

        // 역할 조회까지는 진행되지만 그 이후는 진행되지 않음을 검증
        verify(userRepository).checkEmail(request.getEmail());
        verify(roleRepository).findByCode("ROLE_USER");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("이메일 중복 확인 - 사용 가능한 이메일")
    void checkEmail_ReturnTrue_WhenEmailAvailable() {
        // Given
        String email = "available@example.com";
        when(userRepository.checkEmail(email)).thenReturn(false);

        // When
        boolean result = userService.checkEmail(email);

        // Then
        assertThat(result).isTrue(); // 사용 가능하면 true
        verify(userRepository).checkEmail(email);
    }

    @Test
    @DisplayName("이메일 중복 확인 - 이미 사용 중인 이메일")
    void checkEmail_ReturnFalse_WhenEmailExists() {
        // Given
        String email = "existing@example.com";
        when(userRepository.checkEmail(email)).thenReturn(true);

        // When
        boolean result = userService.checkEmail(email);

        // Then
        assertThat(result).isFalse(); // 이미 사용 중이면 false
        verify(userRepository).checkEmail(email);
    }

    @Test
    @DisplayName("다양한 도메인 테스트 - 일반 도메인들은 ROLE_USER 할당")
    void registerUser_AssignUserRole_ForVariousDomains() {
        // Given
        String[] testEmails = {
            "user@gmail.com",
            "test@naver.com", 
            "admin@company.co.kr",
            "developer@startup.io"
        };
        
        Role userRole = UserTestDataBuilder.createUserRole();
        when(roleRepository.findByCode("ROLE_USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        for (String email : testEmails) {
            // Given
            RegisterUserRequest request = UserTestDataBuilder.createRegisterRequestWithEmail(email);
            when(userRepository.checkEmail(email)).thenReturn(false);

            // When
            User result = userService.registerUser(request);

            // Then
            assertThat(result.getEmail()).isEqualTo(email);
            verify(roleRepository).findByCode("ROLE_USER");
        }
    }
}