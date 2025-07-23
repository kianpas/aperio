# 연결 엔티티와 역할/권한 엔티티 배치 전략

## 1. 현재 문제점
- User, Menu 엔티티가 각자 도메인으로 이동
- 연결 엔티티들이 common/domain에 남아있어 import 오류 발생
- 역할/권한 시스템이 여러 도메인에 걸쳐 사용됨

## 2. 배치 전략 옵션

### 옵션 A: 보안/인증 도메인 생성 (권장)
```
src/main/java/com/wb/between/
├── security/                    # 새로운 보안 도메인
│   ├── domain/
│   │   ├── Role.java           # 핵심 엔티티
│   │   ├── Permission.java     # 핵심 엔티티
│   │   ├── RolePermission.java # 연결 엔티티
│   │   ├── UserRole.java       # 연결 엔티티
│   │   └── MenuRole.java       # 연결 엔티티
│   ├── service/
│   │   ├── RoleService.java
│   │   └── PermissionService.java
│   ├── repository/
│   │   ├── RoleRepository.java
│   │   └── PermissionRepository.java
│   └── dto/
├── user/
│   └── domain/User.java
├── menu/
│   └── domain/Menu.java
└── coupon/
    └── domain/Coupon.java
```

### 옵션 B: 도메인별 분산 배치
```
src/main/java/com/wb/between/
├── user/
│   ├── domain/
│   │   ├── User.java
│   │   └── UserRole.java       # User 도메인 소유
│   └── service/UserRoleService.java
├── menu/
│   ├── domain/
│   │   ├── Menu.java
│   │   └── MenuRole.java       # Menu 도메인 소유
│   └── service/MenuRoleService.java
├── auth/                       # 인증/권한 도메인
│   ├── domain/
│   │   ├── Role.java
│   │   ├── Permission.java
│   │   └── RolePermission.java
│   └── service/
└── common/
    └── (공통 유틸리티만)
```

### 옵션 C: 현재 구조 유지 + Import 수정
```
src/main/java/com/wb/between/
├── common/domain/              # 현재 구조 유지
│   ├── Role.java
│   ├── Permission.java
│   ├── RolePermission.java
│   ├── UserRole.java          # import 경로만 수정
│   └── MenuRole.java          # import 경로만 수정
├── user/domain/User.java
├── menu/domain/Menu.java
└── coupon/domain/Coupon.java
```

## 3. 각 옵션의 장단점

### 옵션 A (보안 도메인) - 권장 ⭐
**장점:**
- 보안 관련 로직이 한 곳에 집중
- 역할/권한 관리가 체계적
- 확장성 좋음 (OAuth, JWT 등 추가 시)
- 도메인 경계가 명확

**단점:**
- 새로운 패키지 구조 필요
- 기존 코드 수정 범위가 큼

### 옵션 B (도메인별 분산)
**장점:**
- 각 도메인의 독립성 높음
- 연결 엔티티가 주 도메인에 속함

**단점:**
- 역할/권한 로직이 분산됨
- 중복 코드 발생 가능성

### 옵션 C (현재 구조 유지)
**장점:**
- 최소한의 변경
- 빠른 문제 해결

**단점:**
- 도메인 경계 모호
- 장기적 유지보수 어려움

## 4. 권장 구현 방안

### 1단계: 보안 도메인 생성
```java
// security/domain/Role.java
@Entity
public class Role {
    // 기존 코드 유지
}

// security/domain/UserRole.java  
@Entity
public class UserRole {
    @ManyToOne
    @JoinColumn(name = "userNo")
    private User user; // user 패키지에서 import
    
    @ManyToOne
    @JoinColumn(name = "roleId")
    private Role role; // 같은 패키지
}
```

### 2단계: 서비스 계층 구성
```java
// security/service/RoleService.java
@Service
public class RoleService {
    // 역할 관리 로직
}

// security/service/UserRoleService.java
@Service  
public class UserRoleService {
    // 사용자-역할 연결 관리
}
```

### 3단계: 기존 코드 마이그레이션
- common/domain → security/domain 이동
- import 경로 수정
- 서비스 로직 정리