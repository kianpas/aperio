package com.portfolio.aperio.user.domain;

import com.portfolio.aperio.coupon.domain.UserCoupon;
import com.portfolio.aperio.role.domain.UserRole;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 요구사항 + 무분별한 생성 방지
@AllArgsConstructor(access = AccessLevel.PRIVATE) // 빌더 전용
@ToString(exclude = {"userCoupons", "userRoles"})
@Table(name = "users")
@EqualsAndHashCode(of = "id")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name="user_status", nullable=false)
    @Builder.Default
    private UserStatus userStatus = UserStatus.ACTIVE; // DB: user_status

    @Enumerated(EnumType.STRING)
    @Column(name="login_method", nullable=false)
    @Builder.Default
    private LoginMethod loginMethod = LoginMethod.EMAIL; // DB: login_method

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // DB: created_at

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // DB: updated_at

    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();

        for (UserRole ur : userRoles) {
            authorities.add(new SimpleGrantedAuthority(ur.getRole().getCode()));
        }
        return authorities;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserCoupon> userCoupons = new HashSet<>(); // 사용자가 가진 쿠폰 목록 (UserCoupon 객체들을 통해 접근)

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserRole> userRoles = new HashSet<>(); // 사용자가 가진 역할 목록

    // === 소셜로그인(OAuth2) 정보 저장을 위한 필드 추가 ===
    @Transient // DB 컬럼으로 만들지 않음 (DB에 저장할 필요 없는 임시 데이터)
    private Map<String, Object> attributes;

    @Transient // DB 컬럼으로 만들지 않음
    private String nameAttributeKey; // 사용자 이름(고유 식별자)을 찾기 위한 키값 (예: naver="response")

    // === OAuth2User 인터페이스 메소드 구현 ===
    // @Override
    // public Map<String, Object> getAttributes() {
    // return this.attributes;
    // }

    /**
     * OAuth2 제공자로부터 받은 사용자 정보 중 이름(사용자 식별자)에 해당하는 값을 반환합니다.
     * Naver는 'response' 객체 안에 'id'가 있고, Google은 'sub' 필드를 사용합니다.
     * nameAttributeKey 필드를 사용하여 이 키를 구분합니다.
     */
    // @Override
    // public String getName() {
    // if (this.nameAttributeKey == null || this.attributes == null) {
    // return this.name; // 또는 userNo.toString() 등 대체 식별자 반환 고려
    // }
    // // Naver 특정 처리 (userNameAttributeName이 'response'일 경우)
    // if ("response".equals(this.nameAttributeKey) &&
    // this.attributes.containsKey("response")) {
    // Object responseObj = this.attributes.get("response");
    //
    // if (responseObj instanceof Map) {
    // @SuppressWarnings("unchecked") // 타입 캐스팅 경고 무시
    // Map<String, Object> responseMap = (Map<String, Object>) responseObj;
    // // Naver 응답에서 실제 ID는 'id' 필드에 있음
    // return (String) responseMap.get("id");
    // }
    // }
    // // Google 등 다른 일반적인 경우 (userNameAttributeName이 'sub' 등일 경우)
    // return (String) this.attributes.get(this.nameAttributeKey);
    // }

    /**
     * CustomOAuth2UserService에서 호출하여 OAuth 관련 정보를 User 객체에 설정
     * 
     * @param attributes       OAuth 제공자로부터 받은 속성 맵
     * @param nameAttributeKey 사용자 이름(고유 식별자) 속성의 키
     * @return this (메소드 체이닝 가능)
     */
    public User oauthUpdate(Map<String, Object> attributes, String nameAttributeKey) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        return this;
    }
    // === 소셜로그인(OAuth2) 정보 저장을 위한 필드 추가 끝 ===

}
