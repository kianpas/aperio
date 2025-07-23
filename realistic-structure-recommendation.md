# 현실적인 구조 권장안

## 현재 상황 분석
- ✅ 이미 admin/role, admin/permission 패키지 존재
- ✅ 관리자 기능이 구현되어 있음
- ❌ 엔티티만 common/domain에 분리되어 있음

## 권장 구조 A: 현재 구조 개선 (최소 변경)

```
src/main/java/com/wb/between/
├── common/
│   └── domain/                    # 공통 엔티티 유지
│       ├── Role.java             # 핵심 엔티티
│       ├── Permission.java       # 핵심 엔티티
│       ├── RolePermission.java   # 연결 엔티티
│       ├── UserRole.java         # 연결 엔티티
│       └── MenuRole.java         # 연결 엔티티
├── admin/
│   ├── role/                     # 역할 관리 (기존)
│   │   ├── controller/AdminRoleController.java
│   │   ├── service/AdminRoleService.java
│   │   ├── repository/AdminRoleRepository.java
│   │   └── dto/
│   ├── permission/               # 권한 관리 (기존)
│   │   ├── controller/AdminPermissionController.java
│   │   ├── service/AdminPermissionService.java
│   │   └── repository/AdminPermissionRepository.java
│   └── rolepermission/           # 역할-권한 연결 관리
│       ├── controller/AdminRolePermissionController.java
│       ├── service/AdminRolePermissionService.java
│       └── repository/AdminRolePermissionRepository.java
├── user/
│   ├── domain/User.java
│   └── service/UserService.java  # UserRole 관리 포함
└── menu/
    ├── domain/Menu.java
    └── service/MenuService.java   # MenuRole 관리 포함
```

## 권장 구조 B: 도메인 통합 (중간 변경)

```
src/main/java/com/wb/between/
├── role/                         # 역할 도메인 (새로 생성)
│   ├── domain/
│   │   ├── Role.java
│   │   ├── Permission.java
│   │   ├── RolePermission.java
│   │   ├── UserRole.java
│   │   └── MenuRole.java
│   ├── service/
│   │   ├── RoleService.java      # 공통 역할 서비스
│   │   └── PermissionService.java
│   └── repository/
├── admin/
│   ├── role/                     # 관리자 역할 관리
│   │   ├── controller/AdminRoleController.java
│   │   ├── service/AdminRoleService.java  # role 도메인 서비스 사용
│   │   └── dto/
│   └── permission/               # 관리자 권한 관리
│       ├── controller/AdminPermissionController.java
│       ├── service/AdminPermissionService.java
│       └── dto/
├── user/
│   ├── domain/User.java
│   └── service/UserService.java
└── menu/
    ├── domain/Menu.java
    └── service/MenuService.java
```

## 권장 구조 C: 완전 분산 (현재 패턴 유지)

```
src/main/java/com/wb/between/
├── role/                         # 역할 도메인
│   ├── domain/Role.java
│   ├── service/RoleService.java
│   ├── repository/RoleRepository.java
│   └── dto/
├── permission/                   # 권한 도메인
│   ├── domain/Permission.java
│   ├── service/PermissionService.java
│   └── repository/PermissionRepository.java
├── rolepermission/              # 역할-권한 연결
│   ├── domain/RolePermission.java
│   ├── service/RolePermissionService.java
│   └── repository/RolePermissionRepository.java
├── userrole/                    # 사용자-역할 연결
│   ├── domain/UserRole.java
│   ├── service/UserRoleService.java
│   └── repository/UserRoleRepository.java
├── menurole/                    # 메뉴-역할 연결
│   ├── domain/MenuRole.java
│   ├── service/MenuRoleService.java
│   └── repository/MenuRoleRepository.java
├── admin/
│   ├── role/
│   │   ├── controller/AdminRoleController.java
│   │   ├── service/AdminRoleService.java    # role 도메인 서비스 사용
│   │   └── dto/
│   └── permission/
│       ├── controller/AdminPermissionController.java
│       ├── service/AdminPermissionService.java
│       └── dto/
├── user/domain/User.java
└── menu/domain/Menu.java
```

## 각 구조의 장단점

### 구조 A (현재 구조 개선) - 권장 ⭐
**장점:**
- 최소한의 변경으로 문제 해결
- 기존 코드 영향 최소화
- 빠른 적용 가능

**단점:**
- common/domain이 여전히 복잡
- 장기적 확장성 제한

### 구조 B (도메인 통합)
**장점:**
- 역할/권한 관련 로직 집중
- 관리자 기능과 도메인 분리
- 확장성 좋음

**단점:**
- 중간 정도의 리팩토링 필요
- 기존 import 경로 수정 필요

### 구조 C (완전 분산)
**장점:**
- 각 도메인 완전 독립
- 마이크로서비스 전환 용이
- 최고의 확장성

**단점:**
- 대규모 리팩토링 필요
- 복잡도 증가
- 작은 프로젝트에는 과도함

## 최종 권장사항

### 즉시 적용: 구조 A (현재 구조 개선)
1. common/domain에 모든 역할/권한 엔티티 유지
2. 기존 admin 패키지 구조 활용
3. import 오류만 수정

### 향후 발전: 구조 B (도메인 통합)
1. 프로젝트 안정화 후 적용
2. role 도메인 생성
3. 단계적 마이그레이션