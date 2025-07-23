# 실무 관점에서의 역할/권한 구조 분석

## 현재 프로젝트 사용 패턴 분석

### 🔍 사용자 관점에서의 역할/권한 사용
1. **User 엔티티**: Spring Security 인증/인가에서 역할 정보 사용
2. **UserService**: 회원가입 시 기본 역할 할당 (ROLE_USER, ROLE_STAFF)
3. **Menu 서비스**: 사용자 역할에 따른 메뉴 필터링
4. **인증/인가**: 컨트롤러에서 @PreAuthorize 등으로 권한 체크

### 🔍 관리자 관점에서의 역할/권한 사용
1. **AdminRoleController**: 역할 CRUD 관리
2. **AdminPermissionController**: 권한 CRUD 관리
3. **AdminRolePermissionController**: 역할-권한 매핑 관리

## 실무에서의 일반적인 구조 패턴

### 패턴 1: 보안 중심 구조 (대기업/금융권)
```
src/main/java/com/company/project/
├── security/                    # 보안 도메인
│   ├── domain/
│   │   ├── Role.java
│   │   ├── Permission.java
│   │   ├── RolePermission.java
│   │   ├── UserRole.java
│   │   └── MenuRole.java
│   ├── service/
│   │   ├── AuthenticationService.java
│   │   ├── AuthorizationService.java
│   │   └── RoleManagementService.java
│   └── repository/
├── admin/
│   └── security/                # 관리자 보안 관리
│       ├── controller/
│       ├── service/
│       └── dto/
└── user/
    ├── domain/User.java
    └── service/UserService.java
```

**특징:**
- 보안 관련 모든 로직이 security 패키지에 집중
- 엄격한 권한 관리 (RBAC, ABAC 등)
- 복잡한 권한 체계 (부서별, 프로젝트별 권한)

### 패턴 2: 도메인 분산 구조 (중견기업/SI)
```
src/main/java/com/company/project/
├── user/
│   ├── domain/
│   │   ├── User.java
│   │   └── UserRole.java        # User 도메인 소유
│   └── service/UserRoleService.java
├── role/
│   ├── domain/
│   │   ├── Role.java
│   │   ├── Permission.java
│   │   └── RolePermission.java
│   └── service/RoleService.java
├── menu/
│   ├── domain/
│   │   ├── Menu.java
│   │   └── MenuRole.java        # Menu 도메인 소유
│   └── service/MenuService.java
└── admin/
    ├── role/                    # 관리자 역할 관리
    ├── permission/              # 관리자 권한 관리
    └── user/                    # 관리자 사용자 관리
```

**특징:**
- 각 도메인이 자신의 역할 관계를 소유
- 도메인 간 독립성 높음
- MSA 전환 시 유리

### 패턴 3: 공통 도메인 구조 (스타트업/중소기업) ⭐
```
src/main/java/com/company/project/
├── common/
│   ├── domain/                  # 공통 엔티티
│   │   ├── Role.java
│   │   ├── Permission.java
│   │   ├── RolePermission.java
│   │   ├── UserRole.java
│   │   └── MenuRole.java
│   └── service/                 # 공통 서비스
│       ├── RoleService.java
│       └── PermissionService.java
├── admin/                       # 관리자 기능
│   ├── role/
│   ├── permission/
│   └── user/
├── user/
│   ├── domain/User.java
│   └── service/UserService.java # 역할 할당 로직 포함
└── menu/
    ├── domain/Menu.java
    └── service/MenuService.java  # 역할 기반 필터링
```

**특징:**
- 빠른 개발과 유지보수 중시
- 공통 로직 중앙화
- 현재 프로젝트와 가장 유사

### 패턴 4: 하이브리드 구조 (대규모 프로젝트)
```
src/main/java/com/company/project/
├── core/
│   └── security/                # 핵심 보안 도메인
│       ├── domain/
│       │   ├── Role.java
│       │   └── Permission.java
│       └── service/
├── integration/                 # 연결 엔티티 전용
│   ├── domain/
│   │   ├── UserRole.java
│   │   ├── MenuRole.java
│   │   └── RolePermission.java
│   └── service/
├── admin/                       # 관리자 기능
│   ├── security/
│   └── user/
├── user/
│   ├── domain/User.java
│   └── service/UserService.java
└── menu/
    ├── domain/Menu.java
    └── service/MenuService.java
```

## 실무 선택 기준

### 프로젝트 규모별 권장
| 규모 | 팀 크기 | 권장 패턴 | 이유 |
|------|---------|-----------|------|
| 소규모 | 1-3명 | 패턴 3 (공통) | 빠른 개발, 단순한 구조 |
| 중규모 | 4-10명 | 패턴 2 (분산) | 도메인 독립성, 확장성 |
| 대규모 | 10명+ | 패턴 1 (보안중심) | 복잡한 권한, 보안 중시 |
| 엔터프라이즈 | 20명+ | 패턴 4 (하이브리드) | 최고 확장성, MSA 대비 |

### 업종별 선호도
| 업종 | 선호 패턴 | 특징 |
|------|-----------|------|
| 금융/보험 | 패턴 1 | 엄격한 보안, 감사 대응 |
| 이커머스 | 패턴 2 | 도메인 복잡성, 확장성 |
| 스타트업 | 패턴 3 | 빠른 개발, MVP 중심 |
| SI/솔루션 | 패턴 3 | 범용성, 커스터마이징 |

## 현재 프로젝트 분석

### 현재 구조의 장점
1. ✅ **실용적**: 공유오피스라는 도메인에 적합
2. ✅ **단순함**: 복잡하지 않은 권한 체계
3. ✅ **확장 가능**: 필요시 분리 가능한 구조
4. ✅ **팀 친화적**: 소규모 팀에 적합

### 개선 방향
1. **단기**: 현재 구조 유지 + 서비스 계층 정리
2. **중기**: 역할 도메인 분리 고려
3. **장기**: 보안 요구사항에 따라 패턴 1 고려

## 결론: 현재 프로젝트에 최적인 구조

### 권장: 패턴 3 (공통 도메인) 개선
```
src/main/java/com/wb/between/
├── common/
│   ├── domain/                  # 역할/권한 엔티티
│   │   ├── Role.java
│   │   ├── Permission.java
│   │   ├── RolePermission.java
│   │   ├── UserRole.java
│   │   └── MenuRole.java
│   └── service/                 # 공통 서비스 추가
│       ├── RoleService.java     # 역할 관리 공통 로직
│       └── PermissionService.java
├── admin/                       # 관리자 기능 (기존 유지)
│   ├── role/
│   ├── permission/
│   └── rolepermission/
├── user/
│   ├── domain/User.java
│   └── service/UserService.java # 역할 할당 로직
└── menu/
    ├── domain/Menu.java
    └── service/MenuService.java  # 역할 기반 필터링
```

**이유:**
1. 🎯 **현재 사용 패턴과 일치**: 사용자/관리자 모두 공통 엔티티 사용
2. 🎯 **실무에서 검증된 구조**: 중소규모 프로젝트에서 널리 사용
3. 🎯 **최소 변경으로 최대 효과**: 기존 코드 영향 최소화
4. 🎯 **확장성 확보**: 필요시 다른 패턴으로 발전 가능